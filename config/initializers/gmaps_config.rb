GMAPS = if ENV['GMAPS_API']
          { 'api_key' => ENV['GMAPS_API'] }
        elsif File.exists?(Rails.root.join("config", "gmaps.yml"))
          YAML.load_file(Rails.root.join("config", "gmaps.yml"))
        end
