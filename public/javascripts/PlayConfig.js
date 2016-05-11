/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with PlayConfig file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 var PlayConfig = {
   fastDraw:false,
   init : function(id){
     PlayConfig.projectName = id;
     PlayConfig.author = PROJECT_DATA.author || "";
     PlayConfig.index = -1;
     PlayConfig.imgURLs = new CachedImageList();
     PlayConfig.annotations = [];
     PlayConfig.animations = [];
     PlayConfig.index = 0;
     PlayConfig.length = PICTURES_DATA.length;
     PlayConfig.notes = [];
     if(__MODE__ == "Import")return 0;
     document.getElementById('savePlaylist').onclick = PlayConfig.postConfig;
     var propertyContents = document.getElementById('property');
     var calibrateContents = document.getElementById('calibrate');
     if(__MODE__ != "play"){
       var editContents = document.getElementById('editProject');
       document.getElementById('takePicture').onclick = function(){
         RecordController.shoot(); 
       };
       document.getElementById('shootMode').onclick = function(){

       };
       document.getElementById('setThumbnail').onclick = function(){
         PlayConfig.setThumbnail(PlayConfig.index);
       };
       document.getElementById('edit_tab').onclick = function(){
         propertyContents.className = "hide"; 
         editContents.className = "show";
         calibrateContents.className = "hide";
         Ca.removeMouseEvent();
       };
     }

     document.getElementById('property_tab').onclick = function(){
       propertyContents.className = "show"; 
       calibrateContents.className = "hide";
       if(__MODE__!="play")editContents.className = "hide";
       Ca.removeMouseEvent();
     };
     document.getElementById('calibrate_tab').onclick = function(){
       propertyContents.className = "hide"; 
       if(__MODE__!="play")editContents.className = "hide";
       calibrateContents.className = "show";
       Ca.addMouseEvent();
     };
   },

   newProjectWizard:function(){
     var d = $.Deferred();
     $('#contents').hide();
     $('#panel').hide();
     document.getElementById('newButton').onclick = function (){
       d.resolve();
     }
     return d.promise();

   },

   initProject: function(id,configFile){
     PlayConfig.init(id);
     PlayConfig.parse(PICTURES_DATA,0);
   },

   parse:function(images,i){
     if(i >= images.length)return 0;
     var image = images[i];
     var res = PlayConfig.imgURLs.push({globalURL:image.url,thumbnailURL:image.thumbnail_url});
     res.loadedImg.then(function(){
         this.parse(images,i+1);
     }.bind(this));
 },

 getConfigList : function () {
   var d = new $.Deferred();
   $.ajax({
       url:"/project/getConfigFiles?project_id=" + PlayConfig.projectName,
       success:function (res,err) {
         PlayConfig.configFileList = JSON.parse(res); 
         d.resolve();
       }
   });
   return d.promise();
 },

 insertIndex: function(src,dst){
   var srcImg = PlayConfig.imgURLs.getURL(src);
   PlayConfig.imgURLs.splice(src,1);
   if (src > dst){
     dst++;
   }
   PlayConfig.imgURLs.splice(dst,0,{globalURL:srcImg});
 },

 removeIndex: function(index){
   PlayConfig.imgURLs.splice(index,1);
 },
 setThumbnail: function(index){
   $.post("/project/setThumbnail",
     {
       project_id:PlayConfig.projectName,
       author:PlayConfig.author,
       thumbnail:index
     },
     function(){},
     "jsonp");
 },

 postConfig: function(){
   $.post("/project/postConfig",
     {
       project_id:PlayConfig.projectName,
       data:JSON.stringify(PlayConfig.imgURLs.list),
       author:PlayConfig.author
     },
     function(){},
     "json");
 }
};
