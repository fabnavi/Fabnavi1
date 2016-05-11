var ProjectList = {
  init : function () {

  },

  load :function () {
    ProjectList.selectedId = "";
    var makeButtons = document.getElementsByClassName('makeButton');
    for (var i = 0; i < makeButtons.length;i++){
      makeButtons[i].onclick = function(e){ 
        ProjectList.selectedId = e.originalTarget.parentElement.id;
        ProjectList.play();
      };
    }

    var deleteButtons = document.getElementsByClassName('deleteButton');
    for (var i = 0; i < deleteButtons.length;i++){
      deleteButtons[i].onclick = function(e){
        ProjectList.selectedId = e.originalTarget.parentElement.id;
        if(confirm("are you sure to delete project :" + ProjectList.selectedId)){
          e.originalTarget.parentElement.remove();
          var data = ProjectList.selectedId.split('/');
          $.get("/project/delete?project_id="+data[1]+"&author="+data[0]);
        }

      }
    }
    var addButtons = document.getElementsByClassName('addButton');
    for (var i = 0; i < addButtons.length;i++){
      addButtons[i].onclick = function(e){
        ProjectList.selectedId = e.originalTarget.parentElement.id;
        ProjectList.add();
      }
    }

    var editButtons = document.getElementsByClassName('editButton');
    for (var i = 0; i < editButtons.length;i++){
      editButtons[i].onclick = function(e){
        ProjectList.selectedId = e.originalTarget.parentElement.id;
        ProjectList.edit();
      }
    }
    ProjectList.select($('li')[0]);
    Keys.projectListKeyBind();
  },

  select : function (target) {
    if(target.tagName != "LI")return 0;
    $('li').removeClass('selectedItem');
    target.className = 'selectedItem';
    ProjectList.selectedId = target.id;
  },

  prev : function () {
    if(ProjectList.selectedId == "")return 0;
    var s = document.getElementById(ProjectList.selectedId).previousElementSibling;
    if(s == null)return 0;
    ProjectList.select(s); 
  },

  next : function () {
    if(ProjectList.selectedId == ""){
      ProjectList.select($("li")[0]);
      return 0;
    }
    var s = document.getElementById(ProjectList.selectedId).nextElementSibling;
    if(s == null)return 0;
    ProjectList.select(s); 
  },

  add : function () {
    if(ProjectList.selectedId == "")return 0;
    alert("Add photo");
    if(ProjectList.selectedId == "newProject"){
      return 0;
    }
    window.location += "add/"+ProjectList.selectedId;
  },

  play : function () {
    if(ProjectList.selectedId == "")return 0;
    if(ProjectList.selectedId == "__newProject__"){
      window.location = "/new";
      return 0;
    }
    window.location += "project/"+ProjectList.selectedId;
  },

  edit : function () {
    if(ProjectList.selectedId == "")return 0;
    if(ProjectList.selectedId == "__newProject__"){
      window.location = "/new";
      return 0;
    }
    window.location += "edit/"+ProjectList.selectedId;
  }
};
