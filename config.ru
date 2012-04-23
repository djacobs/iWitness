# This file is used by Rack-based servers to start the application.

require 'bundler'

Bundler.require

require 'logger'

### Paths
ROOT       = Pathname(File.dirname(__FILE__))
LOGGER     = Logger.new(STDOUT)
SOURCE_DIR = ROOT.join("app")
CSS_DIR    = ROOT.join("app", 'stylesheets')
JSON_DIR   = ROOT.join("app", 'json')
SPECS_DIR  = ROOT.join("spec", 'specs')
VENDOR_DIR = ROOT.join("vendor")
TZDATA_DIR = VENDOR_DIR.join("tzdata")
CONFIG_FILE  = ROOT.join("config.yml")

### Application Sprockets
sprockets = Sprockets::Environment.new(ROOT) do |env|
  env.register_engine '.hbs', Rasputin::HandlebarsTemplate
  env.logger = LOGGER
end

sprockets.append_path(SOURCE_DIR.to_s)
sprockets.append_path(CSS_DIR.to_s)
sprockets.append_path(JSON_DIR.to_s)
sprockets.append_path(VENDOR_DIR.join('bootstrap').to_s)
sprockets.append_path(VENDOR_DIR.join('jquery-ui-bootstrap').to_s)
sprockets.append_path(VENDOR_DIR.join('jquery-ui-bootstrap', 'jquery-ui-bootstrap').to_s)
sprockets.append_path(VENDOR_DIR.to_s)

if File.exists?(CONFIG_FILE)
  CONFIG = YAML.load_file(CONFIG_FILE)
else
  puts "#{CONFIG_FILE} does not exist. Copy from #{CONFIG_FILE}.example"
  exit 1
end

sprockets.context_class.class_eval do
  def env
    ENV['RACK_ENV'] || 'development'
  end

  def config
    CONFIG[env]
  end
end

### Specs Sprockets
sprockets_specs = Sprockets::Environment.new(ROOT) do |env|
  env.register_engine '.hbs', Rasputin::HandlebarsTemplate
  env.logger = LOGGER
end

sprockets_specs.append_path(SOURCE_DIR.to_s)
sprockets_specs.append_path(SPECS_DIR.to_s)
sprockets_specs.append_path(JSON_DIR.to_s)
sprockets_specs.append_path(VENDOR_DIR.to_s)

### Routes
map '/' do
  run proc { |env|
    if env['PATH_INFO'] == '/'
      [200, { 'Content-Type' => 'text/html' }, [sprockets['index.html'].to_s]]
    else
      sprockets.call(env)
    end
  }
end

map '/specs' do
  run proc { |env|
    if env['PATH_INFO'] == ''
      [200, { 'Content-Type' => 'text/html' }, [sprockets_specs['run.html'].to_s]]
    else
      sprockets_specs.call(env)
    end
  }
end

map '/mocks/twitter' do
  run proc { |env|
    req = Rack::Request.new(env)
    file_name = req.params.values_at('fixtureName', 'page', 'max_id').join('_')
    file_path = ROOT.join('spec', 'fixtures', file_name)
    if File.exists?(file_path)
      puts "reading file at #{file_path}"
      [200, { 'Content-Type' => 'text/javascript' }, [File.read(file_path)]]
    end
  }
end

map "/tzdata" do
  run Rack::File.new(TZDATA_DIR)
end
