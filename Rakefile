#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'ap'

Bundler.require

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
  end

  sprockets.append_path(SOURCE_DIR.to_s)

  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)

    prefix, basename = assets.pathname.to_s.split('/')[-2..-1]
    FileUtils.mkpath BUILD_DIR.join(prefix)

    assets.write_to(BUILD_DIR.join(prefix, basename))
    # assets.to_a.each do |asset|
    #   # strip filename.css.foo.bar.css multiple extensions
    #   realname = asset.pathname.basename.to_s.split(".")[0..1].join(".")
    #   asset.write_to(BUILD_DIR.join(prefix, realname))
    # end
  end
end
