function CachableImageList(){

  var list = [],
      waited = 0,
      index = 0,
      d,
      editor,
      editorInitialized = false
  ;

d = $.Deferred();

function initWithURLArray(array){
  pushImageUrlRecursively(array);
}

function initEditor(){
  editor = ThumbnailViewer();
  d.promise().then(editor.init);
  setEditorInitialized();
}

function setEditorInitialized(){
  editorInitialized = true;
}

function getList() {
  return list;
}

function pushImageURL(obj){
  var res = createObject(obj);
  list.push(res);
  return res;
}

function pushLocalImageWithURL(url){
  var res = pushImageURL({localURL:url});
  if(editorInitialized)editor.update(res);
  return res;
}

function pushImageUrlRecursively(images,i){
  i = i || 0;
  if(i >= images.length){
    d.resolve(list);
    return 0;
  }
  var image = images[i];
  var res = pushImageURL({globalURL:image.url,thumbnailURL:image.thumbnail_url});
  res.loadedImg.then(function(){
      pushImageUrlRecursively(images,i+1);
  });
}


function get(n){
  return list[n];
}

function getURL(n){
  if(list.length === 0)return false;
  var res = list[n]
  if(res.hasOwnProperty("localURL"))return res.localURL;
  if(res.hasOwnProperty("globalURL"))return res.globalURL;
  return false;
}


function  getIndexFromLocalURL(url){
  for(i in list){
    if(list[i].localURL == url)return i;
  }
  return -1;
}

function  addGlobalURLFromLocalURL(globalUrl,localUrl){
  var i = getIndexFromLocalURL(localUrl);
  if(i == -1)return -1;
  list[i].globalURL = globalUrl;
}

function addThumbnailURLFromLocalURL(thumbnailUrl,localUrl){
  url = localUrl.replace(/_thumbnail.JPG/,".JPG");
  var i = getIndexFromLocalURL(url);
  if(i == -1)return -1;
  list[i].thumbnailURL= thumbnailUrl;
}

function createObject(obj){
  /* if argObj has not img elem, 
   * add img elem and set src */
  if(!obj.hasOwnProperty("img")){
    obj.img = new Image();
    if(obj.hasOwnProperty("localURL")){
      var d = $.Deferred();
      obj.timer = generateRecTimer(obj);
      obj.img.crossOrigin = "anonymous";
      obj.img.onload = debugSuccessFn(d,obj);
      obj.img.onerror = debugErrorFn(d);
      obj.img.src = obj.localURL;
      obj.loadedImg = d.promise();
    } else if(obj.hasOwnProperty("globalURL")){
      obj.img.src = obj.globalURL;
      var d = $.Deferred();
      obj.img.onload = debugSuccessFn(d,obj);
      obj.img.onerror = debugErrorFn(d);
      obj.img.src = obj.globalURL;
      obj.loadedImg = d.promise();
    }
  }
  return obj;
}

function generateRecTimer(obj){
 console.log("Generate Timer Rec");
      return  window.setTimeout(function(){
        obj.img.src = "";
        obj.img.crossOrigin = "anonymous";
        obj.img.onload = debugSuccessFn(d,obj);
        obj.img.onerror = debugErrorFn(d);
        obj.img.src = obj.localURL;
        obj.timer = generateRecTimer(obj);
      },3000);
}

function debugSuccessFn(d,arg){
  return function(e){
   console.log("LOADED!!");
   console.log(arg);
    if(d != undefined)d.resolve(arg.img);
    window.clearTimeout(arg.timer);
  }
}

function debugErrorFn(d){
  return function(e){
    if(d != undefined)d.reject(e);
  }
}

function getLength(){
  return list.length;
}

function getProgress(){
}

function nextPage(){
  if(list.length === 0)return index;
  if(index < list.length-1){
    index++;  
  } else {
    index = 0;
  }
  if(editorInitialized)editor.next();
  return index;
}

function setPage(i){
  if(i < 0 || i >= list.length) return false;
  index = i;
  if(editorInitialized)editor.reload();
  return index;
}

function prevPage(){
  if(list.length === 0)return index;
  if(index > 0) { 
    index--;  
  } else {
    index = list.length -1;
  }
  if(editorInitialized)editor.prev();
  return index;
}

function loadImage(){
 console.log(index);
  if(list.length != 0)return list[index].loadedImg;
  else return false;
}

function splice(a,b){
  list.splice(a,b); 
}

function getListDeferred(){
  return d.promise();
}

function updateList(a){
  var res = []; 
  for(var i in a){
    res.push(findElementFromUrl(a[i]));     
  }
  list = res;
}

function findElementFromUrl(url){
  for(var i in list){
    if(list[i].globalURL == url || list[i].localURL == url)return list[i];
  }
  return -1;
}

function toggleEditor(){
  if(editorInitialized)editor.toggleEditor();
  else console.log("Editor is not initialized");
}

function remove(i){
  list.splice(i,1);
  console.log(index);
  console.log(list.length);
  if(index >= list.length)index = list.length - 1;
  if(editorInitialized){
   editor.update();
   editor.setPage(index);
  }
  Director.reloadPage();
}

function getIndex(){
  return index;
}

return {
  initWithURLArray:initWithURLArray,
  list:getList,
  getListDeferred:getListDeferred,
  length:getLength,
  updateListWithURLArray:updateList,
  push:pushLocalImageWithURL,
  next:nextPage,
  prev:prevPage,
  setPage:setPage,
  getDeferredImage:loadImage,
  splice:splice,
  toggleEditor:toggleEditor,
  initEditor:initEditor,
  remove:remove,
  index:getIndex,
  setEditorInitialized:setEditorInitialized,
  get:get,
};

};
