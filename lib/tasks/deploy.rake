namespace :deploy do

  APPS = %w[ wsj wapo seat sacp ]

  def heroku_apps
    APPS.map {|r| "#{r}-iwitness"}
  end

  desc "set all environment variables on heroku"
  task :api_token do
    token = ENV["GMAPS_API"]
    raise "must provide GMAPS_API" unless token
    heroku_apps.each do |app|
      sh "heroku config:add GMAPS_API=#{token} --app #{app}"
    end
  end

  desc "push to all heroku instances"
  task :production do
    APPS.each do |app|
      sh "git push #{app} master --force"
    end
  end
end
