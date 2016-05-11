var OldImporter = {
  loadProject:function(name){
    queue = new WorkQueue();
    var url = "/data/"+name+"/fabnavi.play.config";
    PlayConfig.projectName = name;
    CommonController.getContents(url)
    .done(function(res){
        console.log(res);
        OldImporter.parse(res);
    })
    .fail(function(){
        CommonController.getJSON("getProject?project_id="+name,
          function(result, error) {
            if (error) {
              alert(error);
              return;
            }
            console.log(result);
            OldImporter.parse(res);
        });
    });
    PlayConfig.author = AUTHOR_NAME;
    console.log(this);
    $("li").hide();
  },
  pushAllData:function(){
    for(i in PlayConfig.imgURLs.list){
      queue.push(PlayConfig.imgURLs.list[i])
   }
  },
  parse: function(xml){ //called once when project loaded
    var parser = new DOMParser();
    doc = parser.parseFromString(xml, "application/xml");
    var animations = OldImporter.getObjectsFromXML(doc,parseRule['animation']);
    var annotations = OldImporter.getObjectsFromXML(doc,parseRule['annotation']);
    var imgurls = OldImporter.getObjectsFromXML(doc,parseRule['imgurls']);
    var notes = OldImporter.getObjectsFromXML(doc,parseRule['notes']);
    if(animations.length > 0)for(i in animations){
      animations[i].index--;
      PlayConfig.animations.push(animations[i]);
    }

    if(annotations.length > 0)for(i in annotations){
      annotations[i].index--;
      PlayConfig.annotations.push(annotations[i]);
    }

    if(notes.length > 0)for(i in notes){
      PlayConfig.notes.push(notes[i]);
    }

    for(i in imgurls){
      var url = imgurls[i].url;
      console.log(url);
      PlayConfig.imgURLs.push({localURL:url});
    }
  },
  getObjectsFromXML: function(xml,conf){
    var nodes= xml.getElementsByTagName(conf.tag);
    if(nodes.length == 0){
      return {};
    }
    var objs = [];
    nodes = nodes[0].children;
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].tagName == conf.name){
        var obj = {};
        for(key in conf.values){
          var v = nodes[i].getAttribute(key);
          if(v == null){
            console.log("Attribute " +key+" not found");
          }
          else if(conf.values[key] == 'int'){
            var r = parseInt(v,10);
            if(isNaN(r))console.log(v+" is declared as int, but NaN");
            else obj[key] = r;
          }else if(conf.values[key] == 'string'){
            obj[key] = v;
          } else {
            console.log("cannot understand the type :"+conf.values[key] + " of " + key);
          }
        }
        objs.push(obj);
      }
    }
    return objs;
  },
};


var parseRule ={
  animation:{
    tag:'animations', 
    name:'animation',
    values:{
      startindex:'int',
      endindex:'int',
      duration:'int'
    }
  },
  annotation:{
    tag:'annotations',
    name:'annotation',
    values:{
      index:'int',
      image:'string',
      x:'int',
      y:'int',
      w:'int',
      h:'int',
      angle:'int'
    }    
  },
  imgurls:{
    tag:'imgurls',
    name:'imgurl',
    values:{
      index:'int',
      url:'string'
    }
  },
  notes:{
    tag:'notes',
    name:'note',
    values:{
      index:'int',
      url:'string'
    }
  }
};
