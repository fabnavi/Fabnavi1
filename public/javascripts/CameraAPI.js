var CameraAPI = {

  init:function () {
    document.sonycameracontroller.setup({ipaddress: "10.0.0.1", port: 10000, version: "1.0"});
    console.log("init");
    document.sonycameracontroller.zoomIn();
    document.sonycameracontroller.zoomOut();
    document.sonycameracontroller.zoomOutAll();
    window.setTimeout(function(){
      CameraAPI.zoomOnce()
      .then(function(){return CameraAPI.zoomOnce()})
      .then(function(){return CameraAPI.zoomOnce()})
      .then(function(){return CameraAPI.zoomOnce()})
      .then(function(){return CameraAPI.zoomOnce()})
    },3000);
  },
  zoomOnce:function(){
    var d = $.Deferred();
    console.log("zoom");
    document.sonycameracontroller.zoomIn(function(res){
      console.log(res);
      setTimeout(function(){
        d.resolve();
      },700);
    });
    return d.promise();
  },

  shoot:function () {
    var d = $.Deferred();
    var listener = 
      function (url,res) {
        d.resolve(url);

      };
    document.sonycameracontroller.take(listener);
    return d.promise();
  }

};
