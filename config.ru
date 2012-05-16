# This file is used by Rack-based servers to start the application.

ENVIRONMENT = ENV['RACK_ENV'] || 'development'

require './boot'

### Routes
map '/' do
  run proc { |env|
    if env['PATH_INFO'] == '/'
      [200, { 'Content-Type' => 'text/html' }, [SprocketsApp['index.html'].to_s]]
    else
      SprocketsApp.call(env)
    end
  }
end

map '/maptest' do
  run proc { |env|
    [200, { 'Content-Type' => 'text/html' }, [SprocketsApp['maptest.html'].to_s]]
  }
end

map '/specs' do
  run proc { |env|
    if env['PATH_INFO'] == ''
      [200, { 'Content-Type' => 'text/html' }, [SprocketsApp['run.html'].to_s]]
    else
      SprocketsApp.call(env)
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
