/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 var PlayController = {
   currentURL:"",
   currentImg:"",

   init: function() {
     PlayController.defaultInit();
     Ca.init();
     $('#panel').hide();
     $('#contents').show();
     PlayController.photoList = new PhotoList();
     Keys.playerKeyBind();
   },

   defaultInit : function () {
     this.cvs = document.getElementById('cvs');
     this.ctx = this.cvs.getContext('2d');
     this.cvs.width = screen.width;
     this.cvs.height = screen.height;
     PlayController.showCalibrateLine();
   },

   showCalibrateLine : function (){
     PlayController.ctx.beginPath();
     PlayController.ctx.moveTo(0,PlayController.cvs.height/2);
     PlayController.ctx.lineTo(PlayController.cvs.width,PlayController.cvs.height/2);
     PlayController.ctx.moveTo(PlayController.cvs.width/2,0);
     PlayController.ctx.lineTo(PlayController.cvs.width/2,PlayController.cvs.height);
     PlayController.ctx.stroke();
   },

   exitProject : function(){
     PlayController.photoList.clear();
   },

   load: function() {
     ProjectList.load();
   },

   draw: function(imgElem,isRaw){
    PlayController.drawImage(isRaw,imgElem);
     if(PlayConfig.fastDraw){
       for(i in PlayConfig.notes){
         if(PlayConfig.notes[i].index == PlayConfig.index)PlayController.drawNote(PlayConfig.notes[i].url);
       }
     } else {
       window.setTimeout(function(){
           for(i in PlayConfig.notes){
             if(PlayConfig.notes[i].index == PlayConfig.index)PlayController.drawNote(PlayConfig.notes[i].url);
           }
       },150);
     }
   },
   drawImage:function(isRaw,image,cvs){
     var d = $.Deferred();
     try{
       isRaw = isRaw || IS_CALIBRATION;
       var cvs = cvs || PlayController.cvs;
       var ctx = cvs.getContext('2d');
       if(isRaw){
         var sx = Number(CommonController.localConfig.x);
         var sy = Number(CommonController.localConfig.y);
         var sw = Number(CommonController.localConfig.w);
         var sh = Number(CommonController.localConfig.h);

         var dx = 0;
         var dy = 0;
         var dw = cvs.width;
         var dh = cvs.height;

         ctx.fillStyle = "black"; 

         if(sy < 0){
           var StoDh = dh/sh; 
           dy = sy*StoDh;
           dh += dy;
           sh += sy;
           sy = 0;
           dy *=-1;
           ctx.fillRect(0,0,cvs.width,dy);
         } 

         if(sx < 0){ 
           var StoDw = dw/sw;
           dx = sx*StoDw;
           dw += dx;
           sw += sx;
           sx = 0;
           dx *= -1;
           ctx.fillRect(0,0,dx,cvs.height);
         }

         if(sx + sw > image.width){
           var StoDw = dw/sw;
           sw -= (sx + sw - image.width);
           dw = sw*StoDw;
           ctx.fillRect(dx+dw,0,cvs.width-dx-dw,cvs.height);
         }

         if(sy + sh > image.height){
           var StoDh = dh/sh;
           sh -= (sy + sh - image.height);
           dh = sh*StoDh;
           ctx.fillRect(0,dy+dh,cvs.width,100);
         }
         PlayController._drawImage(ctx,image,sx,sy,sw,sh,dx,dy,dw,dh,d);
       } else {
         PlayController._drawImage(ctx,image,0,0,image.naturalWidth,image.naturalHeight,0,0,screen.width,screen.height,d);
       }

     } catch (e){
       d.reject(e);
     }
     return d.promise();
   },

   _drawImage:function(ctx,image,sx,sy,sw,sh,dx,dy,dw,dh,d){
     ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
     d.resolve();
   },

   play: function(id) {
     $('#contents').show();
     Ca.initProject(id);
     if(CommonController.localConfig == ""){
       CommonController.localConfig = {x:0,y:0,w:$('#photo').width(),h:$('#photo').height()};
     }
     PlayConfig.initProject(id);
     if(PICTURES_DATA.length != 0) PlayController.playSlide(id);
   },

   playSlide : function(id){
     PlayController.photoList.update();
     document.title = "Play: " +id;
     var parameters = PlayController.getParametersFromQuery();
     var startIndex = 0;
     if (parameters["s"]) {
       startIndex = parseInt(parameters["s"])-1;
     }
     CommonController.getLocalConfig(id);
     PlayController.show(startIndex);
     $("#contents").show();
   },

   getParametersFromQuery: function () {
     var parameters = {};
     var url = window.location.href;
     var indexOfQ = url.indexOf("?");
     if (indexOfQ >= 0) {
       var queryString = url.substring(indexOfQ + 1);
       var params = queryString.split("&");
       for (var i = 0, n = params.length; i < n; i++) {
         var param = params[i];
         var keyvalue = param.split("=");
         parameters[keyvalue[0]] = keyvalue[1];
       }
       parameters["QueryString"] = queryString;
     }
     return parameters;
   },

   previous: function() {
     if (PlayConfig.index == 0) {
       PlayController.show(PlayConfig.imgURLs.length-1);
     } else {
       PlayController.show(Number(PlayConfig.index)-1);
     }
   },

   next: function() {
     if (PlayConfig.index == PlayConfig.imgURLs.length-1) {
       PlayController.show(0);
     } else {
       PlayController.show(Number(PlayConfig.index)+1);
     }
   },

   show: function(index,force,freezeAspect) {
     if(force == undefined)force = false; 
     if(freezeAspect == undefined)freezeAspect = false;
     PlayController.setPhoto(Number(index),force,freezeAspect);
     $("#arrow").text("");
     clearTimeout(PlayController.timerid);
     /* Annotations */
     $('.annotations').remove();
     for (var i=0; i<PlayConfig.annotations.length;i++){
       if(index == PlayConfig.annotations[i].index){
         PlayController.setAnnotation(
           PlayConfig.annotations[i].x,
           PlayConfig.annotations[i].y,
           PlayConfig.annotations[i].angle);
       }
     }
     PlayController.current_animation = null;
     PlayConfig.index = Number(index);
   },

   setPhoto: function(index,force,freezeAspect) { /* force : force to reload image */
     var data = PlayConfig.imgURLs.get(index);
     var url = data.img.src;
     var img = data.img;
     var isRaw = data.localURL ? true : false;
     data.loadedImg.done(function(){
         PlayController.ctx.clearRect(0,0,PlayController.cvs.width,PlayController.cvs.height);
         PlayController.draw(img,isRaw);
         PlayController.currentImg = img;
         Ca.updateXYFromWH();
         PlayController.currentURL = url;
         PlayController.photoList.selectByName(url);
         $("#counter").text((Number(index)+1)+"/"+PlayConfig.length);
         $('#cvs').css('display','block');
         $('#contents').show();
     });
     $('#photo').css('display','none');
   },

   info : function(){
     var elem = $('#panel');
     if(elem.is(":visible"))
       elem.hide();
     else 
       elem.show();
   }
 }

