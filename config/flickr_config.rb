FLICKR = if ENV['FLICKR_API']
          { 'api_key' => ENV['FLICKR_API'],
            'api_secret' => ENV['FLICKR_SECRET']}
        elsif File.exists?(Rails.root.join("config", "flickr.yml"))
          YAML.load_file(Rails.root.join("config", "flickr.yml"))
        end
