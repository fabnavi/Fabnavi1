Gdworker::App.controllers :old do

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
    @res = []
    Dir.chdir(Fabnavi::DATADIR)
    Dir.glob('*').each do |t|
      Dir.chdir(t)
      picts = Dir.glob('*.{jpg,JPG}')  
      @res.push({:id=>t,:thumbnail=>("data/"+t+"/"+picts[0].to_s)})
      Dir.chdir("../")
    end
    render 'old/index'
  end
  get "getProject" do 
    id = params[:project_id]
    res = []
    Dir.chdir(Fabnavi::DATADIR + id+ "/original")
    Dir.glob('*.{jpg,JPG}').each do |t|
      res.push("data/"+id+"/original/"+t)
    end
    res.to_json
  end

  get "getConfigFiles" do
    id = params[:project_id]
    Dir.chdir(Fabnavi::DATADIR + id + "/")
    res = []
    Dir.glob('*.config').each do |file|
      res.push("data/" + id + "/" + file)
    end
    res.to_json
  end


end
