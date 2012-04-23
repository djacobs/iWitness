ENVIRONMENT = 'production'

require './boot'
require 'ap'
require 'fileutils'

Dir.glob('lib/tasks/*.rake').each { |r| import r }

directory BUILD_DIR.to_s

desc "remove all built assets"
task :clean do
  FileUtils.rm_r(BUILD_DIR) if File.exists?(BUILD_DIR)
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
