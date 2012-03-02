# This file is used by Rack-based servers to start the application.

require 'bundler'

Bundler.require

require 'logger'

ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = Logger.new(STDOUT)
# BUNDLES     = %w( stylesheets/application.css javascripts/application.js )
SOURCE_DIR  = ROOT.join("app", "assets")

map '/assets' do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(SOURCE_DIR.to_s)
  run sprockets
end

map '/' do
  run Rack::File.new('app/views/index.html')
end
