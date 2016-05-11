require "fabnavi_utils"
Gdworker::App.controllers :project do
  before do
  end

  post "/postConfig" do
    data = params[:data]
    imgURLs = JSON.parse data
    proj = Project.find_project(params[:author],params[:project_id])
    pictureURLs= proj.picture
    imgURLs.each_with_index do |url,i|
      unless url = imgURLs[i]["globalURL"] then next end 
      unless pict = pictureURLs.find_by(:url =>url) then
        pict = Picture.new(:url => url ,:project => proj)
      end
      pict.order_in_project = i+1

      if thumbnail = imgURLs[i]["thumbnailURL"] then
        pict.thumbnail_url = thumbnail
      end
      pict.save
    end
    "hoge"
  end

  get "/delete" do
    unless session[:authorName] == params[:author] then return end
    res = Project.find_project(params[:author],params[:project_id])
    res.try(:delete)
  end

  post "/setThumbnail" do
    unless session[:authorName] == params[:author] then return end
    index = params[:thumbnail]
    project_name = params[:project_id]
    author = params[:author]
    proj = Project.joins(:author).readonly(false).where(:project_name => project_name, :authors => {:name => author}).first
    proj.thumbnail_picture_id = index.to_i+1
    proj.save
  end 

  post "/postPicture" do
    #TODO check the header of pict
    unless session[:authorName] == params[:author] then 
      return 
    end
    data = params[:data]
    id = params[:project_id]
    url = params[:url]
    pict = Base64.decode64(data)
    fileName =File.basename(/^http.*.(?i:JPG)/.match(url)[0])
    filePath = id+'/'+fileName
    puts filePath
    save_pict_S3(filePath,pict)
    "https://s3-ap-northeast-1.amazonaws.com/files.fabnavi/"+filePath
  end 

  post "/new" do
    @projectName = params[:ProjectName]
    @authorName = session[:authorName]
    proj = Project.joins(:author).find_by(:authors=>{name:@authorName},:project_name =>@projectName)
    if proj == nil then
      author = Author.find_by(:email => session[:email], :name => @authorName)
      p = Project.new 
      p.author = author
      p.project_name = @projectName
      p.status = 0
      p.thumbnail_picture_id = 0
      if p.save then 
        redirect_to "/add/"+@authorName+"/"+@projectName
      else 
        flash[:notice] = "Error Something."
        render "project/newProject"
      end 
    else 
      flash[:notice] = "Project name is Duplicated. Change project name"
      render "project/newProject"
    end
  end
end
