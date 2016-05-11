Gdworker::Admin.controllers :pictures do
  get :index do
    @title = "Pictures"
    @pictures = Picture.all
    render 'pictures/index'
  end

  get :new do
    @title = pat(:new_title, :model => 'picture')
    @picture = Picture.new
    render 'pictures/new'
  end

  post :create do
    @picture = Picture.new(params[:picture])
    if @picture.save
      @title = pat(:create_title, :model => "picture #{@picture.id}")
      flash[:success] = pat(:create_success, :model => 'Picture')
      params[:save_and_continue] ? redirect(url(:pictures, :index)) : redirect(url(:pictures, :edit, :id => @picture.id))
    else
      @title = pat(:create_title, :model => 'picture')
      flash.now[:error] = pat(:create_error, :model => 'picture')
      render 'pictures/new'
    end
  end

  get :edit, :with => :id do
    @title = pat(:edit_title, :model => "picture #{params[:id]}")
    @picture = Picture.find(params[:id])
    if @picture
      render 'pictures/edit'
    else
      flash[:warning] = pat(:create_error, :model => 'picture', :id => "#{params[:id]}")
      halt 404
    end
  end

  put :update, :with => :id do
    @title = pat(:update_title, :model => "picture #{params[:id]}")
    @picture = Picture.find(params[:id])
    if @picture
      if @picture.update_attributes(params[:picture])
        flash[:success] = pat(:update_success, :model => 'Picture', :id =>  "#{params[:id]}")
        params[:save_and_continue] ?
          redirect(url(:pictures, :index)) :
          redirect(url(:pictures, :edit, :id => @picture.id))
      else
        flash.now[:error] = pat(:update_error, :model => 'picture')
        render 'pictures/edit'
      end
    else
      flash[:warning] = pat(:update_warning, :model => 'picture', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy, :with => :id do
    @title = "Pictures"
    picture = Picture.find(params[:id])
    if picture
      if picture.destroy
        flash[:success] = pat(:delete_success, :model => 'Picture', :id => "#{params[:id]}")
      else
        flash[:error] = pat(:delete_error, :model => 'picture')
      end
      redirect url(:pictures, :index)
    else
      flash[:warning] = pat(:delete_warning, :model => 'picture', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy_many do
    @title = "Pictures"
    unless params[:picture_ids]
      flash[:error] = pat(:destroy_many_error, :model => 'picture')
      redirect(url(:pictures, :index))
    end
    ids = params[:picture_ids].split(',').map(&:strip)
    pictures = Picture.find(ids)
    
    if Picture.destroy pictures
    
      flash[:success] = pat(:destroy_many_success, :model => 'Pictures', :ids => "#{ids.to_sentence}")
    end
    redirect url(:pictures, :index)
  end
end
