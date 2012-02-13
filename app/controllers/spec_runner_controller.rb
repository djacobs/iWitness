class SpecRunnerController < ApplicationController
  def run
    params[:debug_assets] = true
    render :layout => nil
  end
end
