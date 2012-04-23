#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require './boot'
require 'ap'
require 'fileutils'

Dir.glob('lib/tasks/*.rake').each { |r| import r }

BUNDLES     = [ 'index.html', 'application.css', 'application.js', 'timezones.json' ]

directory BUILD_DIR.to_s

desc "remove all built assets"
task :clean do
  FileUtils.rm_r(BUILD_DIR) if File.exists?(BUILD_DIR)
end

desc "compile all files into the assets directory"
task :compile => [:clean, BUILD_DIR.to_s] do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
    env.js_compressor = Uglifier.new
    env.css_compressor = YUI::CssCompressor.new
    env.register_engine '.hbs', Rasputin::HandlebarsTemplate
  end
  sprockets.append_path(SOURCE_DIR.to_s)
  sprockets.append_path(CSS_DIR.to_s)
  sprockets.append_path(JSON_DIR.to_s)
  sprockets.append_path(VENDOR_DIR.to_s)
  sprockets.context_class.class_eval do
    def env
      'production'
    end

    def config
      CONFIG[env]
    end
  end

  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)
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
