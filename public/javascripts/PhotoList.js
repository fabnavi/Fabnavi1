function PhotoList() {
  this.init($('#panel'));
}

PhotoList.prototype = new ListController("photoList");

PhotoList.prototype.append = function (data) {
  var a = data.split('/');
  var str = a[a.length-1];
  var id = str.split('.')[0];
  this.appendRow(id,str);
}

PhotoList.prototype.rowClicked = function(e){
  if(this.selectedLast() == e.currentTarget.id){ // clicked
    this.select(e.currentTarget.id);
    for(i in PlayConfig.imgURLs.list){
      if(PlayConfig.imgURLs.getURL(i).indexOf(e.currentTarget.id) != -1){
        PlayConfig.index = i;
        PlayController.show(i);
        break;
      }
    }
    this.selected = [e.currentTarget.id];
  } else {
    this.insert(e.currentTarget.id,this.selectedLast());
    e.currentTarget.style.transform = "";
    document.getElementById(this.selectedLast()).style.transform = "";
  }
};

PhotoList.prototype.rowDblClicked = function (e) {
  this.selected.push(e.currentTarget.id);
  this.insert(e.currentTarget.id,this.selectedLast());
  e.currentTarget.style.transform = "";
  document.getElementById(this.selectedLast()).style.transform = "";
}

PhotoList.prototype.rowMouseDown = function (e) {
  this.selected.push(e.currentTarget.id);
  this.idToElem(e.currentTarget.id).css("transform","translateX(-20px)");
  this.select(e.currentTarget.id);
}

PhotoList.prototype.selectByName = function(data){
  var a = data.split('/');
  var str = a[a.length-1];
  var name = str.split('.')[0];
  this.select(name);
}

PhotoList.prototype.remove = function (index) {
  PlayConfig.removeIndex(index);
  PlayConfig.postConfig();
  this.removeRow(); 
}

PhotoList.prototype.insert = function (id1,id2) {
  var a = this.idToElem(id1);
  var b = this.idToElem(id2);
  PlayConfig.insertIndex(b.index()-1,a.index()-1);
  this.insertRow(a,b);
}

PhotoList.prototype.update = function () {
  for(i in PlayConfig.imgURLs.list){
    this.append.call(this,PlayConfig.imgURLs.getURL(i));
  }
}
