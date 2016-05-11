function CachedImageList(){
  this.list = [];
  this.length = 0;
  this.waited = 0;
}

CachedImageList.prototype = {
 push:function(obj){
    var result = this.createObject(obj);
    this.list.push(result);
    this.update();
    return result;
  },

  createObject:function(obj){
    /* if argObj has not img elem, 
     * add img elem and set src */
    if(!obj.hasOwnProperty("img")){
      obj.img = new Image();
      if(obj.hasOwnProperty("localURL")){
        var d = $.Deferred();
        obj.img.crossOrigin = "anonymous";
        obj.img.onload = debugSuccessFn("local image Loaded",d,obj.img);
        obj.img.onerror = debugErrorFn("local Image cannot load",d);
        obj.img.src = obj.localURL;
        obj.loadedImg = d.promise();
      } else if(obj.hasOwnProperty("globalURL")){
        obj.img.src = obj.globalURL;
        var d = $.Deferred();
        obj.img.onload = debugSuccessFn("Global image Loaded",d,obj.img);
        obj.img.onerror = debugErrorFn("Global Image cannot load",d);
        obj.img.src = obj.globalURL;
        obj.loadedImg = d.promise();
      }
    }
    return obj;
  },

  get:function(n){
    return this.list[n];
  },

  getURL:function(n){
    if(this.list.length == 0)return false;
    var res = this.list[n]
    if(res.hasOwnProperty("localURL"))return res.localURL;
    if(res.hasOwnProperty("globalURL"))return res.globalURL;
    return false;
  },

  getIndexFromLocalURL:function(url){
    for(i in this.list){
      if(this.list[i].localURL == url)return i;
    }
    return -1;
  },
  addGlobalURLFromLocalURL:function(globalUrl,localUrl){
    var i = this.getIndexFromLocalURL(localUrl);
    if(i == -1)return -1;
    this.list[i].globalURL = globalUrl;
  },
  addThumbnailURLFromLocalURL:function(thumbnailUrl,localUrl){
    url = localUrl.replace(/_thumbnail.JPG/,".JPG");
    var i = this.getIndexFromLocalURL(url);
    if(i == -1)return -1;
    this.list[i].thumbnailURL= thumbnailUrl;
  },

  init:function(){
    this.list = [];
    this.length = 0;
  },

  update:function(){
    this.length = this.list.length;
  },

  splice:function(a,b,obj){
   var result = null;
    if(obj == undefined){
      this.list.splice(a,b);
    }else {
      result = this.createObject(obj);
      this.list.splice(a,b,result);
    }
    this.update();
    return result;
  }
}


function debugSuccessFn(mes,d,arg){
  return function(e){
   /*
    console.log("Success-------------------");
    console.log(mes);
    console.log(e);
    console.log("-----------------------END");
    */
    if(d != undefined)d.resolve(arg); 
  }
}

function debugErrorFn(mes,d){
  return function(e){
   /*
    console.log("ERROR=================");
    console.log(mes);
    console.log(e);
    console.log("=================END");
    */
    if(d != undefined)d.reject(e); 
  }
}
