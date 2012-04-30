ENVIRONMENT = 'production'

require './boot'
require 'ap'
require 'fileutils'

Dir.glob('lib/tasks/*.rake').each { |r| import r }

directory BUILD_DIR.to_s

desc "remove all built assets"
task :clean do
  mkdir_p BUILD_DIR
  rm_rf Dir.glob(File.join(BUILD_DIR, '*'))
end

desc "compile all files into the assets directory"
task :compile => [:clean, BUILD_DIR.to_s] do
  bundles = [ 'index.html', 'application.css', 'application.js', 'timezones.json' ]

  bundles.each do |bundle|
    assets = SprocketsApp.find_asset(bundle)
    assets.write_to(BUILD_DIR.join(bundle).to_s)
  end

  cp_r TZDATA_DIR, BUILD_DIR, :verbose => true
  cp_r IMAGES_DIR, BUILD_DIR, :verbose => true
  cp_r FONTS_DIR, BUILD_DIR, :verbose => true
end

task :not_dirty do
  fail "Directory not clean" if /nothing to commit/ !~ `git status`
end

file 'assets/.git/refs/heads/gh-pages' do
  repo_url = `git config --get remote.origin.url`.strip

  cd BUILD_DIR do
    sh "git init"
    sh "git remote add origin #{repo_url}"
    sh "git fetch origin"
    sh "git checkout gh-pages"
  end
end

task :prepare_gh_pages => [:clean, 'assets/.git/refs/heads/gh-pages']

task :get_latest => :prepare_gh_pages do
  cd BUILD_DIR do
    sh 'git pull origin gh-pages'
  end
end

desc "Publish the app to Github Pages."
task :publish => [:not_dirty, :prepare_gh_pages, :get_latest, :compile] do
  head = `git log --pretty="%h" -n1`.strip
  message = "Site updated to #{head}"

  File.open 'assets/index.html', 'a' do |file|
    file << "<!-- #{head} -->"
  end

  cd BUILD_DIR do
    sh 'git add --all'
    if /nothing to commit/ =~ `git status`
      puts "No changes to deploy"
    else
      sh "git commit -m \"#{message}\""
      sh 'git push origin gh-pages'
    end
  end
end

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
