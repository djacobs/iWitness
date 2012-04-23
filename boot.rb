require 'bundler'
Bundler.require
require 'pathname'
require 'logger'

LOGGER     = Logger.new(STDOUT)

ROOT       = Pathname(File.dirname(__FILE__))
BUILD_DIR  = ROOT.join("assets")
SOURCE_DIR = ROOT.join("app")
CSS_DIR    = ROOT.join("app", 'stylesheets')
IMAGES_DIR = ROOT.join("app", 'images')
FONTS_DIR  = ROOT.join("app", 'fonts')
JSON_DIR   = ROOT.join("app", 'json')
SPECS_DIR  = ROOT.join("spec", 'specs')
VENDOR_DIR = ROOT.join("vendor")
TZDATA_DIR = VENDOR_DIR.join("tzdata")
CONFIG_FILE = ROOT.join("config.yml")

if File.exists?(CONFIG_FILE)
  CONFIG = YAML.load_file(CONFIG_FILE)
else
  puts "#{CONFIG_FILE} does not exist. Copy from #{CONFIG_FILE}.example"
  exit 1
end

SprocketsApp = Sprockets::Environment.new(ROOT) do |env|
  env.register_engine '.hbs', Rasputin::HandlebarsTemplate
  env.logger = LOGGER

  if ENVIRONMENT == 'production'
    env.js_compressor = Uglifier.new
    env.css_compressor = YUI::CssCompressor.new
  end
end

SprocketsApp.append_path(SOURCE_DIR.to_s)
SprocketsApp.append_path(CSS_DIR.to_s)
SprocketsApp.append_path(JSON_DIR.to_s)
SprocketsApp.append_path(VENDOR_DIR.to_s)
if ENVIRONMENT == 'development'
  SprocketsApp.append_path(SPECS_DIR.to_s)
end

SprocketsApp.context_class.class_eval do
  def env
    ENVIRONMENT
  end

  def config
    CONFIG[env]
  end
end
