Gdworker::App.controllers :camera do

  get '/' do
   render :apiList
  end


  get '/api/:type' do 
    api = CameraAPI.new
    p = params[:params]
    if p == nil then
      query = api.generateOp params[:type],[]
    else 
      query = api.generateOp params[:type], p
    end
    @doc = api.fire query
    render :api_result
  end


  get '/:type' do 
    api = CameraAPI.new
    p = params[:params]
    if p == nil then
      query = api.generateOp params[:type],[]
    else 
      query = api.generateOp params[:type], p
    end
    @doc = api.fire query
    render :log
  end

  get '/takepicture' do
    api = CameraAPI.new
    query = api.generateOp("actTakePicture")
    @doc = api.fire query
    @url = @doc['result'][0][0]
    render 'log'
  end
end
