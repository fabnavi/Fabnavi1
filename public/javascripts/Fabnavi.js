__DEBUG__ = false;
IS_CALIBRATION = false;
var Fabnavi = {
  play:function () {
    __MODE__ = "play";
    queue = new WorkQueue();
    PlayController.init(); 
    PlayController.play(PROJECT_DATA.projectName);
  },
  update:function(){
    __MODE__ = "update";
    queue = new WorkQueue();
    CameraAPI.init();
    PlayController.init(); 
    RecordController.newProject();
    PlayController.play(PROJECT_DATA.projectName);
  },

  showProjectList:function () {
    ProjectList.load();
    Fabnavi.authInit(); 
  },

  newProject:function (id) {
    __MODE__ = "new";
    CameraAPI.init();
    queue = new WorkQueue();
    PlayConfig.newProjectWizard().done(function(){
        PlayController.init(); 
        RecordController.newProject();
        Ca.addMouseEvent();
    });
  },

  importer:function(){
    Fabnavi.authInit();
    __MODE__ = "Import";
    PROJECT_DATA = {};
    PlayConfig.init("");
  },

  authInit:function(){
    var signIn = document.getElementById('signin');
    var signOut= document.getElementById('signout');
    var author_name = document.getElementById('author_name');
    var author_email = document.getElementById('author_email');
    var avatar = document.getElementById('avatar');
    var header = document.getElementById('header');
    if(AUTHOR_EMAIL != null){
      author_email.textContent = AUTHOR_EMAIL;
      if(AUTHOR_NAME != null){
        author_name.textContent = AUTHOR_NAME;
        signIn.style.display = "none";
        header.onclick = function(){
         console.log("clicked");
          if(signOut.className == ""){
            signOut.className = "show";
          } else {
            signOut.className = "";
          }
        };
      }else {
        header.className = "";
      }

    } else {
      author_email.textContent = "Plese sign in with Persona";
      signOut.style.display = "none";
      author_name.className = "hide";
      author_email.className = "hide";
      avatar.className = "hide";
      header.className = "hide";
    }

    if(signIn){
      signIn.onclick = function(){navigator.id.request();};
    }
    if(signOut){
      author_name.onclick = null;
      signOut.onclick = function(){navigator.id.logout();};
    }

    navigator.id.watch({
        loggedInEmail:AUTHOR_EMAIL,
        onlogin: function(assertion){
          $.ajax(
            { type : 'POST',
              url: '/auth/login',
              data:{assertion:assertion},
              success:function(res,status,xhr){
                console.log(res);
                window.location = res;
              },
              error:function(res,status,xhr){
                console.log(res);
                alert("login failure" + res);
              },
          });
        },

        onlogout:function(){
          $.ajax(
            {type:'POST',
              url:'/auth/logout',
              success:function(res,status,xhr){window.location.reload();},
              error:function(res,status,xhr){alert("logout failure" + res);},
          });
            }
        });
      }
    };
