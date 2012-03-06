# This file is used by Rack-based servers to start the application.

require 'bundler'

Bundler.require

require 'logger'

ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = Logger.new(STDOUT)
# BUNDLES     = %w( stylesheets/application.css javascripts/application.js )
SOURCE_DIR  = ROOT.join("app", "assets")

GMAPS = if ENV['GMAPS_API']
          { 'api_key' => ENV['GMAPS_API'] }
        elsif File.exists?(ROOT.join("config", "gmaps.yml"))
          YAML.load_file(ROOT.join("config", "gmaps.yml"))
        end
puts GMAPS

map '/assets' do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.register_engine '.hbs', Rasputin::HandlebarsTemplate
    env.logger = LOGGER
  end

  sprockets.append_path(SOURCE_DIR.to_s)
  run sprockets
end

map '/assets/timezones.json' do |name|
  run Rack::File.new("app/assets/json/timezones.json")
end

map '/assets/zone_offsets.json' do |name|
  run Rack::File.new("app/assets/json/zone_offsets.json")
end

map '/' do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(ROOT.join('app', 'views'))

  sprockets.context_class.class_eval do
    def maps
      GMAPS
    end
  end

  run proc { |env| [200, { 'Content-Type' => 'text/html' }, [sprockets['index.html'].to_s]] }
end

