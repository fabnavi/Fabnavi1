function ConfigList(){
  this.init($('#panel'));
}

ConfigList.prototype = new ListController("configList");


ConfigList.prototype.load = function () {
  PlayConfig.getConfigList().done(function(){
    PlayConfig.configFileList = PlayConfig.configFileList.reverse();
    for(i in PlayConfig.configFileList){
      var data = PlayConfig.configFileList[i].updated_at;
      var a = data.split('/');
      var str = a[a.length-1];
      var id = str.split('.')[0];
      id = id.replace(" ","_","g");
      id = id.replace(":","_","g");
      this.appendRow(id,str);
    }
    this.select("fabnavi");
  }.bind(this));
}

ConfigList.prototype.rowClicked = function (e) {
  var config = "data/"+PlayConfig.projectName+"/"+e.currentTarget.children[1].textContent; 
  var projectName = PlayConfig.projectName;
  PlayController.exitProject();
  PlayConfig.initProject(projectName,config).done(function(){;
    PlayController.photoList.update();
    PlayController.show(0);
  });
  this.select(e.currentTarget.id);
}

ConfigList.prototype.update = function () {
}
