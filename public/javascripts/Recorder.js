/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 var RecordController = {

   newProject : function() {
     $("#start").hide();
     $('#projectList').hide();
     PlayConfig.init();
     //    Ca.initProject("  ");
     Keys.recorderKeyBind(); 
   },

   shoot: function() {
     $('#shoot').hide();
     $('#projectList').hide();
     $('#contents').hide();
     clearTimeout(RecordController.timer);
     RecordController.timer = setTimeout(function() {
         var p = CameraAPI.shoot();
         p.then(function(url, error) {
             if (error) {
               alert(error);
               return;
             }
             console.log("********SHOOT***********");
             console.log(url);
             var obj = PlayConfig.imgURLs.splice(PlayConfig.index+1,0,{localURL:url});
             queue.push(obj);
             PlayConfig.length++;
             RecordController.updateList();
             PlayController.next();
             if(PlayConfig.index > 0)Ca.removeMouseEvent();
             PlayController.show(PlayConfig.index,true);
         });
     }, 10);
   },
   updateList: function () {
     PlayController.photoList.clear();
     for(key in PlayConfig.imgURLs.list){
       PlayController.photoList.append(PlayConfig.imgURLs.getURL(key));
     }
   }
 };

