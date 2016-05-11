/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
 var Ca = {
   x:0,
   y:0,
   w:1000,
   h:1000,
   cx:0,
   cy:0,
   lx:0,
   ly:0,
   drag:false,
   zi:false,
   zo:false,
   as:1,
   aspShift:false,
   zoomIn :function (_shift) {
     var shift = _shift | 10;
     Ca.w -= shift;
     Ca.h -= shift*Ca.as;
     Ca.update();
   },
   zoomOut:function (_shift) {
     var shift = _shift | 10;
     Ca.w += shift;
     Ca.h += shift*Ca.as;
     Ca.update();
   },
   init: function(){
     var zoomOutBtn = document.getElementById('zoomOut');
     var zoomInBtn = document.getElementById('zoomIn');
     var aspBtn = document.getElementById('aspectShift');
     zoomInBtn.onmousedown = function(){
       Ca.zi = true;
     };
     zoomInBtn.onmouseup= function(){
       Ca.zi = false;
     };
     zoomInBtn.onmouseleave= function(){
       Ca.zi = false;
     };
     zoomOutBtn.onmousedown= function(){
       Ca.zo = true;
     };
     zoomOutBtn.onmouseup= function(){
       Ca.zo = false;
     };
     zoomOutBtn.onmouseleave= function(){
       Ca.zo = false;
     };

     aspBtn.onclick = function (e) {
       Ca.aspShift = !Ca.aspShift;
     }

     setInterval(function(){
         if(Ca.zi)Ca.zoomIn();
         if(Ca.zo)Ca.zoomOut();
     },50);
     Ca.image = document.getElementById('photo');
     $("#save").click(Ca.saveConfig);
     Ca.updateXYFromWH();
   },

   addMouseEvent:function(){
    IS_CALIBRATION = true;
     var cvs = document.getElementById('cvs');
     window.onwheel = function(e){
       e.preventDefault();
       var y = e.deltaY;
       if(y>0)Ca.zoomOut(y);
       else Ca.zoomIn(-y);
     };
     cvs.onmousedown = function (e) {
       Ca.drag = true;
       Ca.lx = e.clientX;
       Ca.ly = e.clientY;
     };
     cvs.onmouseup = function (e){
       Ca.drag = false;
     };
     cvs.onmousemove= function (e){
       if(Ca.drag){
         if(Ca.aspShift){
           Ca.w += Ca.lx - e.clientX;
           Ca.update();
           Ca.updateXYFromWH();
         }else {
           Ca.cx -= Ca.lx - e.clientX;
           Ca.cy += e.clientY - Ca.ly; 
           Ca.lx =  e.clientX;
           Ca.ly =  e.clientY;
           Ca.update();
         }
       }
     };
   },

   removeMouseEvent:function(){
    IS_CALIBRATION = false;
     var cvs = document.getElementById('cvs');
     window.onwheel = "";
     cvs.onmousedown = "";
     cvs.onmouseup = "";
     cvs.onmousemove= "";
   },

   updateXYFromWH:function () {
     Ca.as = Ca.h/Ca.w;
     Ca.cx = Math.floor(Ca.w/2) + Number(Ca.x);
     Ca.cy = Math.floor(Ca.h/2) + Number(Ca.y);
   },

   updateXYFromCenter:function(){
     Ca.x = Ca.cx - Math.floor(Ca.w/2);
     Ca.y = Ca.cy - Math.floor(Ca.h/2);
   },

   updateLocalConfig:function(){
     CommonController.localConfig = {
       x:Ca.x,y:Ca.y,w:Ca.w,h:Ca.h
     };
   },

   saveConfig : function(){
     if(CommonController.localConfig != "")CommonController.setLocalConfig(PlayConfig.projectName);
   },

   update : function(){
     Ca.updateXYFromCenter();
     Ca.updateLocalConfig();
     PlayController.show(PlayConfig.index,true);
   },

   initProject: function(id) {
     CommonController.getLocalConfig(id);
     if(CommonController.localConfig != ""){
       Ca.x = Number(CommonController.localConfig.x);
       Ca.y = Number(CommonController.localConfig.y);
       Ca.w = Number(CommonController.localConfig.w);
       Ca.h = Number(CommonController.localConfig.h);
     }
   }
 }

