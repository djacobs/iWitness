GMAPS = if ENV['GMAPS_API']
          { 'api_key' => ENV['GMAPS_API'] }
        else
          YAML.load_file(Rails.root.join("config", "gmaps.yml"))
        end
