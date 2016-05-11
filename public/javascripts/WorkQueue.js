THUMBNAIL_WIDTH = 440;
THUMBNAIL_HEIGHT = 320;

function WorkQueue(){
  this.queue = [];
  this.runninng=false;
  this.start();
  noticeElem = document.getElementById('notice') ; 
}

WorkQueue.prototype = {
  push : function (obj) {
    this.queue.push(obj);
  },


  getProgress : function () {

  },

  clear : function () {
    this.queue = [];
    this.runninng = false;
  },

  start : function(){
    this.timer = setInterval(function(){
        this.fire(); 
    }.bind(this),5000);
  },

  stop : function () {
    clearInterval(this.timer); 
  },

  fire: function () {
    if(this.runninng){
      return 0;
    }
    this.runninng = true;
    if (this.queue.length < 1) {
      this.runninng = false;
      notice("No task");
      return -1;
    }
    var cachedImage = this.queue[0];
    var url = cachedImage.img.src;
    if(cachedImage.hasOwnProperty("loadedImg")){
      notice("Loading Image...");
      cachedImage.loadedImg.done(function(img){
          this.convertImgToDataURL(img,url)
          .then(this.postPicture)
          .then(this.updateURLList)
          .fail(function(e){
              console.log(e.toSource());
          });
           this.convertImgToDataURL(img,url,true)
           .then(this.postPicture)
           .then(this.updateURLList)
           .fail(function(e){
               console.log(e.toSource());
           });
      }.bind(this));
    } else { 
      notice("There is no img");
      this.runninng = false;
    }
  },

  convertImgToDataURL:function(img,url,isThumbnail){
    notice("Converting...");
    isThumbnail = isThumbnail || false;
    var d = $.Deferred();
    var bufCvs = document.createElement("canvas");
    if(isThumbnail){
      bufCvs.width = THUMBNAIL_WIDTH;
      bufCvs.height = THUMBNAIL_HEIGHT;
      url = url.replace(/.JPG/,"_thumbnail.JPG");
    } else {
      bufCvs.width = screen.width;
      bufCvs.height = screen.height;
    }
    PlayController.drawImage(true,img,bufCvs)
    .done(function(){
        d.resolve(bufCvs.toDataURL("image/jpeg").substring(23),url,isThumbnail);
    });
    return d.promise();
  },

  updateURLList:function(resultUrl,url,isThumbnail){
    var d = $.Deferred();
    notice("Image Posted!!!");
    var res = resultUrl.replace("\"","","g");
    if(isThumbnail){
      PlayConfig.imgURLs.addThumbnailURLFromLocalURL(res,url);
    } else {
      PlayConfig.imgURLs.addGlobalURLFromLocalURL(res,url);
    }
    if(__MODE__ != "Import")RecordController.updateList();
    notice("Posting Playlist Files...");
    PlayConfig.postConfig();
    notice("Posted Playlist Files!!");
    queue.queue.splice(0,1);
    queue.runninng = false;
    d.resolve();
    return d.promise();
  },

  postPicture:function(data,url,isThumbnail){
    notice("Posting Picture....");
    var d = $.Deferred();
    $.post("/project/postPicture",
      { 
        data:data,
        project_id:PlayConfig.projectName,
        author:PlayConfig.author,
        url:url
      },function(res,err){
        if(err != "success"){
          console.log(err);
          notice("Error to post picture");
          this.runninng = false;
          d.reject(err);
        } else {
          d.resolve(res,url,isThumbnail);
        }
    });
    return d.promise();
  }
};
var notice = function(mes){
  var str = mes + ". There're "+queue.queue.length +" tasks.";
  if(noticeElem)noticeElem.textContent = str;
  else document.title =  str;
}
