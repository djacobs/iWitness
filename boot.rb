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
