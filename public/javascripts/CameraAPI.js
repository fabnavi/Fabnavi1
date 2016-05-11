var CameraAPI = {

  init:function () {
    if(document.sonycameracontroller == undefined){
      alert("Addon is not  installed");
      //TODO : redirect to addon install page
      return false;
    }
    document.sonycameracontroller.setup({ipaddress: "10.0.0.1", port: 10000, version: "1.0"},false);
    /*
    document.sonycameracontroller.zoomIn();
    document.sonycameracontroller.zoomOut();
    document.sonycameracontroller.zoomOutAll();
    window.setTimeout(function(){
        CameraAPI.zoomOnce()
        .then(function(){return CameraAPI.zoomOnce()})
    },3000);
    */
  },
  zoomOnce:function(){
    var d = $.Deferred();
    document.sonycameracontroller.zoomIn(function(res){
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
