function ListController(listId){
  this.listId = listId;
}　

ListController.prototype = {
  selected:[],
  init : function (target) {
    this.elem = $(
      '<tbody id="'+this.listId+'">\
      <tr>\
      <td>#</td>\
      <td>'+this.listId+'</td>\
      </tr>\
      </tbody>');
    target.append(this.elem);
    $('#delete').click(function(){
        this.remove(PlayConfig.index);
    }.bind(this));
  },

  show : function (){
  },

  appendRow : function (id,str){
    var row = $('<tr draggable="true" class="data" id="'+id+'"><td draggable="true" class="tableIndex">'+this.elem.children().length+': </td><td draggable="true">'+str+'</td></tr>'); 

    row.on('mousemove',function(e){this.rowMoved(e)}.bind(this));
    row.on('dblclick',function(e){this.rowDblClicked(e)}.bind(this));
    row.on('mouseup',function(e){this.rowClicked(e)}.bind(this));
    row.on('mouseenter',function(e){this.rowMouseEnter(e)}.bind(this));
    row.on('mouseleave',function(e){this.rowMouseLeave(e)}.bind(this));
    row.on('mousedown',function(e){this.rowMouseDown(e)}.bind(this));
    $('#'+this.listId).append(row);
  },

  insertRow : function (id1,id2){
    id1.after(id2);
  },

  selectedLast : function(){
    return this.selected[this.selected.length-1];
  },

  removeRow: function(index){
    var elem = this.idToElem(this.selectedLast());
    elem.remove();
  },

  idToElem: function(id){
    return $('#'+id);
  },

  rowClicked: function(e){
    console.log("rowClicked method is not implemented");
  },

  rowDblClicked: function(){
    console.log("rowDblClicked method is not implemented");
  },

  rowMoved:function(e){
    if(e.buttons > 0){
      var el = this.idToElem(this.selectedLast());
      var h = e.clientY - el[0].offsetTop-10;
      el.css("transform","translate(-20px,"+h+"px)");
    } 
  },

  rowMouseLeave : function(e){
    this.idToElem(e.currentTarget.id).css("transform","translateX(0px)");
  },
  rowMouseDown: function () {
    console.log("rowMouseDown method is not implemented");
  },
  rowMouseEnter:function (e) {
    this.idToElem(e.currentTarget.id).css("transform","translateX(20px)");
  },

  select: function(id){
    var target = this.idToElem(id);
    this.selected.push(id);
    $('#'+this.listId+' .data').css('background-color','transparent');
    target.css('background-color','rgba(200,0,0,0.7)');
  },

  clear : function(){
    var ch = $("#"+this.listId).children();
    for(var i = 1; i< ch.length; ++i){
      ch[i].remove();
    }
  }
};
