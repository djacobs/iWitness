#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require 'bundler'
require 'ap'

Bundler.require

require 'pathname'
require 'logger'
require 'fileutils'

ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = Logger.new(STDOUT)
BUNDLES     = %w( stylesheets/application.css javascripts/application.js )
BUILD_DIR   = ROOT.join("assets")
SOURCE_DIR  = ROOT.join("app", "assets")

task :cleanup do
  FileUtils.rm_r(BUILD_DIR.children)
  touch(BUILD_DIR.join('.gitkeep'))
end

task :compile => :cleanup do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
    env.js_compressor = Uglifier.new if ENV = :production
    env.css_compressor = YUI::CssCompressor.new
  end
  sprockets.append_path(SOURCE_DIR.to_s)

  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)

    prefix, basename = assets.pathname.to_s.split('/')[-2..-1]
    FileUtils.mkpath BUILD_DIR.join(prefix)

    assets.write_to(BUILD_DIR.join(prefix, basename))
  end
end
