Gdworker::App.controllers :author do
  get '/register' do
    render :register
  end

  post '/create' do
    a = Author.new
    a.name = params[:username]
    a.email = session["email"]
    #TODO check the name if duplicated 
    if a.save then 
      session[:authorName] = a.name
      redirect_to "/"
    else 
      session.destroy
      redirect_to "/"
    end  
  end

end
