ENVIRONMENT = 'production'

require './boot'
require 'ap'
require 'fileutils'

BUILD_DIR = File.join(File.dirname(__FILE__), "assets")

Dir.glob('lib/tasks/*.rake').each { |r| import r }

directory BUILD_DIR

desc "remove all built assets"
task :clean do
  mkdir_p BUILD_DIR
  rm_rf Dir.glob(File.join(BUILD_DIR, '*'))
  cd(BUILD_DIR) { sh "git init" }
end

desc "compile all files into the assets directory"
task :compile => [:clean, BUILD_DIR.to_s] do
  bundles = [ 'index.html', 'application.css', 'application.js', 'timezones.json' ]

  bundles.each do |bundle|
    assets = SprocketsApp.find_asset(bundle)
    assets.write_to File.join(BUILD_DIR, bundle)
  end

  cp_r TZDATA_DIR, BUILD_DIR, :verbose => true
  cp_r IMAGES_DIR, BUILD_DIR, :verbose => true
  cp_r FONTS_DIR, BUILD_DIR, :verbose => true
end

task :not_dirty do
  fail "Directory not clean" if /nothing to commit/ !~ `git status`
end

# file 'assets/.git/refs/heads/gh-pages' do
#   repo_url = `git config --get remote.origin.url`.strip

#   cd BUILD_DIR do
#     sh "git init"
#     sh "git remote add #{remote} #{repo_url}"
#     sh "git fetch origin"
#     sh "git checkout gh-pages"
#   end
# end

# task :prepare_gh_pages => [:clean, 'assets/.git/refs/heads/gh-pages']

# task :get_latest => :prepare_gh_pages do
#   cd BUILD_DIR do
#     sh 'git pull origin gh-pages'
#   end
# end

namespace :publish do
  Dir.entries(".git/refs/remotes").each do |remote|
    next if remote =~ /^\.{1,2}$/ # skip . and ..
    remote_branch = "assets/.git/refs/remotes/#{remote}/gh-pages"

    file remote_branch => BUILD_DIR do
      repo_url = `git config --get remote.#{remote}.url`.strip

      cd BUILD_DIR do
        sh "git init"
        sh "git remote add #{remote} #{repo_url}"
        sh "git fetch #{remote}"
        sh "git checkout gh-pages"
        sh "git pull #{remote} gh-pages"
      end
    end

    desc "Publish to Github Pages; remote=#{remote}."
    task remote.to_sym => [:not_dirty, remote_branch, :clean, :compile] do
      head = `git log --pretty="%h" -n1`.strip
      message = "Site updated to #{head}"

      File.open 'assets/index.html', 'a' do |file|
        file << "<!-- #{head} -->"
      end

      cd BUILD_DIR do
        sh 'git add --all'
        if /nothing to commit/ =~ `git status`
          puts "No changes to commit."
        else
          sh "git commit -m \"#{message}\""
        end
        sh "git push #{remote} gh-pages"
      end
    end
  end
end

desc "Publish to Github Pages; remote=origin."
task :publish => :"publish:origin"


# desc "Publish the app to Github Pages."
# task :oldpublish => [:not_dirty, :prepare_gh_pages, :get_latest, :compile] do
#   head = `git log --pretty="%h" -n1`.strip
#   message = "Site updated to #{head}"

#   File.open 'assets/index.html', 'a' do |file|
#     file << "<!-- #{head} -->"
#   end

#   cd BUILD_DIR do
#     sh 'git add --all'
#     if /nothing to commit/ =~ `git status`
#       puts "No changes to deploy"
#     else
#       sh "git commit -m \"#{message}\""
#       sh 'git push origin gh-pages'
#     end
#   end
# end

desc "Run tests with phantomjs"
task :test do
  unless system("which phantomjs > /dev/null 2>&1")
    abort "PhantomJS is not installed. Download from http://phantomjs.org"
  end

  with_test_server_running do
    cmd = "phantomjs spec/run-jasmine.js \"http://localhost:9299/specs\""

    if system(cmd)
      puts "Tests Passed".green
    else
      puts "Tests Failed".red
      exit(1)
    end
  end
end

def with_test_server_running
  puts "Starting server"
  `rackup --port 9299 --daemonize --pid test_server.pid`
  sleep 3
  yield
  %x(kill -9 `cat test_server.pid` && rm test_server.pid)
end

task :default => :test



namespace :tz do

  directory "vendor/tzdata"

  desc <<-END
import a new version of the olsen database.
get the latest version from http://www.iana.org/time-zones.
extract it locally, then call this task.
rake tz:import FROM=path/to/new/tzdata
END
  task :import => "vendor/tzdata" do
    from = ENV["FROM"] && ROOT.join(ENV["FROM"])
    to   = ROOT.join("vendor", "tzdata")
    unless from && File.exists?(from)
      puts "you must include a FROM!\nrake tz:import FROM=path/to/new/tzdata"
      puts "FROM=#{from}"
      exit 1
    end

    Dir.foreach(from) do |file|
      # files we care about have no file extension
      # also skipping . and ..
      next if file.index(".")
      copy_without_comments(from.join(file), to.join(file))
    end
  end

  def copy_without_comments(infile, outfile)
    File.open(infile, "r:utf-8:ascii", :invalid => :replace, :replace => '') do |i|
      puts "opening #{infile}"
      File.open(outfile, "w") do |o|
        done = false
        until done
          begin
            l = i.readline
            if l !~ /^#.*$/ && l != "\n"
              o.write l
            end
          rescue EOFError
            done = true
          end
        end
      end
    end
  end
end
