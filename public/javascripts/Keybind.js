/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with PlayConfig file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

 var Keys = {
   projectListKeyBind: function () {
     window.onkeydown = function(e) {
       console.log(e.keyCode);
       switch (e.keyCode) {
         case 37 :
         case 97 : {
           ProjectList.prev();
           break;
         }
         case 39 :
         case 99 : {
           ProjectList.next();
           break;
         }
         case 80 : 
         case 13: {
           ProjectList.fire();
           break;
         }
         case 65 :/* Add */
         {
           break;
         }
         case 69 :/* Edit */
         {

           break;
         }
         case 104:
         case 38:  /* up */
         {
           ProjectList.up();
           break;
         }
         case 98:
         case 40:  /* down */
         {
           ProjectList.down();
           break;
         }
         case 68 :/* delete */
         case 46 :
         {
           break;
         }
         case 78 :/* New Proj*/
         {
           ProjectList.selectedId = "__newProject__";
           ProjectList.play();
           break;
         }
       }
     };

   },

   playerKeyBind: function () {
     window.onkeydown = function(e) {
       console.log(e.keyCode);
       switch (e.keyCode) {
         /* escape */
         case 103:
         case 27 : 
         {
          returnToIndex();
           break;
         }
         case 37 :
         case 97 : {
           if(!Keys.isActive())PlayController.previous();
           break;
         }
         case 39 :
         case 99 : {
           if(!Keys.isActive())PlayController.next();
           break;
         }
         case 13: {
           //        Note.shoot();
           break;
         }

         case 105:
         case 86 : {
           PlayController.info();
           break;
         }
         // Common Key Bind
         case 219:{
           if(e.ctrlKey)document.activeElement.blur();
           break;
         }
         case 73:{
           Ca.zi = true;
           break;
         }
         case 79:{
           Ca.zo = true;
           break;
         }
         case 65: {
           Ca.aspShift = !Ca.aspShift;
         }
       }
     };

     window.onkeyup = function (e){
       switch(e.keyCode){
         case 73:{
           Ca.zi = false;
           break;
         }
         case 79:{
           Ca.zo = false;
           break;
         }
       }
     };

   },

   recorderKeyBind: function () {
     window.onkeydown = function(e) {
       console.log(e.keyCode);
       switch (e.keyCode) {
         case 103:
         case 27 : 
         {
           //         returnToIndex(); 
           window.location= "/";
           break;
         }
         case 37:
         case 97:
         case 52 : {
           if(!Keys.isActive())PlayController.previous();
           break;
         }
         case 39:
         case 99:
         case 54 : {
           if(!Keys.isActive())PlayController.next();
           break;
         }
         case 13: {
           RecordController.shoot();
           break;
         }
         case 86 :
         case 72 : {
           PlayController.info();
           break;
         }
         // Common Key Bind
         case 219:{
           if(e.ctrlKey)document.activeElement.blur();
           break;
         }
         case 73:{
           Ca.zi = true;
           break;
         }
         case 79:{
           Ca.zo = true;
           break;
         }
         case 65: {
           Ca.aspShift = !Ca.aspShift;
         }
       }
     };
     window.onkeyup = function (e){
       switch(e.keyCode){
         case 73:{
           Ca.zi = false;
           break;
         }
         case 79:{
           Ca.zo = false;
           break;
         }
       }
     };
   },
   isActive: function(){
     var id = document.activeElement.id;
     var i = ['x','y','w','h'].indexOf(id);
     if(i == -1)return false;
     else return true;
   }
 };
