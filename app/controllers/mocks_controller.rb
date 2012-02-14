require 'net/http'
class MocksController < ApplicationController
  def twitter
    twitter_params = params.except(:cassette, :targetUrl, :controller, :action)
    file_name      = params.values_at('fixtureName', 'page', 'max_id').join('_')
    file_path      = Rails.root.join('spec', 'fixtures', file_name)

    if File.exists?(file_path)
      puts "reading file at #{file_path}"
      render :file => file_path, :layout => false
    else
      url = params[:targetUrl].sub("callback=?", "")
      url.sub(/\??$/, "?")
      url << twitter_params.map do |k, v|
        "#{k}=#{CGI.escape(v)}"
      end.join("&")

      puts url
      response = Net::HTTP.get_response(URI(url))
      puts "writing file at #{file_path}"
      File.open(file_path, 'w') { |f| f << response.body }

      render :text => response.body, :content_type => response.content_type
    end
  end
end
