Iwitness::Application.routes.draw do
  root :to => 'pages#index'
  get "/specs" => 'spec_runner#run'
  get "/mocks/:action", :controller => 'mocks'
end
