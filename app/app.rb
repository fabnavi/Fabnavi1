require "socket"
require "json"
require "pp"
require "open-uri"
require "uri"
require "resque"
require "redis"
require "camera_api"
require "fabnavi_utils"
require "base64"
require "date"

require "rexml/document"
require "aws-sdk"

include Fabnavi

$host = "10.0.0.1"
$port = 10000

module Gdworker
  class App < Padrino::Application
    use ActiveRecord::ConnectionAdapters::ConnectionManagement
    register ScssInitializer
    register Padrino::Mailer
    register Padrino::Helpers

    enable:sessions
    disable:protect_from_csrf

    Resque.redis = Redis.new

    get '/' do
      @email = session[:email] ||= "null"
      @name = "null"
      if not @email == "null" then
        author = Author.find_by(:email => @email)
        @email = "\""+@email+"\""
        if author == nil then
          @name = "\"UNREGISTERED\""
        else
          @name = "\""+author.name.to_s+"\""
        end
      end
      @projects= Project.project_list_LP
      render 'project/index' 
    end

    get "/project/:author/:project/" do
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/project'
      end
    end

    get "/update/:author/:project/" do
      id = Project.find_project(params[:author],params[:project]).id
      @picturesData= Picture.pictures_list(id)
      @projectData = {:author=> params[:author],:projectName => params[:project]}
      if @projectData == nil then
        render 'errors/404'
      else 
        render 'project/update'
      end
    end

    get "/new" do
      flash[:notice] = "Start"
      render 'project/newProject'
    end

    error 404 do
      render 'errors/404'
    end

  end
end
