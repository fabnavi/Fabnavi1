Gdworker::Admin.controllers :annotations do
  get :index do
    @title = "Annotations"
    @annotations = Annotation.all
    render 'annotations/index'
  end

  get :new do
    @title = pat(:new_title, :model => 'annotation')
    @annotation = Annotation.new
    render 'annotations/new'
  end

  post :create do
    @annotation = Annotation.new(params[:annotation])
    if @annotation.save
      @title = pat(:create_title, :model => "annotation #{@annotation.id}")
      flash[:success] = pat(:create_success, :model => 'Annotation')
      params[:save_and_continue] ? redirect(url(:annotations, :index)) : redirect(url(:annotations, :edit, :id => @annotation.id))
    else
      @title = pat(:create_title, :model => 'annotation')
      flash.now[:error] = pat(:create_error, :model => 'annotation')
      render 'annotations/new'
    end
  end

  get :edit, :with => :id do
    @title = pat(:edit_title, :model => "annotation #{params[:id]}")
    @annotation = Annotation.find(params[:id])
    if @annotation
      render 'annotations/edit'
    else
      flash[:warning] = pat(:create_error, :model => 'annotation', :id => "#{params[:id]}")
      halt 404
    end
  end

  put :update, :with => :id do
    @title = pat(:update_title, :model => "annotation #{params[:id]}")
    @annotation = Annotation.find(params[:id])
    if @annotation
      if @annotation.update_attributes(params[:annotation])
        flash[:success] = pat(:update_success, :model => 'Annotation', :id =>  "#{params[:id]}")
        params[:save_and_continue] ?
          redirect(url(:annotations, :index)) :
          redirect(url(:annotations, :edit, :id => @annotation.id))
      else
        flash.now[:error] = pat(:update_error, :model => 'annotation')
        render 'annotations/edit'
      end
    else
      flash[:warning] = pat(:update_warning, :model => 'annotation', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy, :with => :id do
    @title = "Annotations"
    annotation = Annotation.find(params[:id])
    if annotation
      if annotation.destroy
        flash[:success] = pat(:delete_success, :model => 'Annotation', :id => "#{params[:id]}")
      else
        flash[:error] = pat(:delete_error, :model => 'annotation')
      end
      redirect url(:annotations, :index)
    else
      flash[:warning] = pat(:delete_warning, :model => 'annotation', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy_many do
    @title = "Annotations"
    unless params[:annotation_ids]
      flash[:error] = pat(:destroy_many_error, :model => 'annotation')
      redirect(url(:annotations, :index))
    end
    ids = params[:annotation_ids].split(',').map(&:strip)
    annotations = Annotation.find(ids)
    
    if Annotation.destroy annotations
    
      flash[:success] = pat(:destroy_many_success, :model => 'Annotations', :ids => "#{ids.to_sentence}")
    end
    redirect url(:annotations, :index)
  end
end
