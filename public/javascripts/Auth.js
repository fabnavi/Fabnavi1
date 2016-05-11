
function auth(){
  var url = "https://accounts.google.com/o/oauth2/auth?";
  var scope = "scope=email%20profile%20https://picasaweb.google.com/data/&";
  var state = "state=%2Fprofile&";
  var redirect_uri = "redirect_uri="+encodeURI("http://localhost:3000/user/auth/callback")+"&";
  var response_type = "response_type=token&";
  var client_id = "client_id=932266335355-jj5fd3k4hourei6djtrb6pd3l49rsitg.apps.googleusercontent.com";
  url += scope + state+redirect_uri+response_type+client_id;
  window.location = url;
}


function getAlbumList() {
  if(ACCESS_TOKEN == undefined)return false;
  var d = $.Deferred();
  var url = "https://picasaweb.google.com/data/feed/api/user/default?kind=album"
    url += "&alt=json&access_token=" + ACCESS_TOKEN;
  $.ajax({
    url:url,
    type:"get",
    dataType:"jsonp",
    success:function(res){
      console.log(res);
      var albums  = res.feed.entry;
      d.resolve(albums);
    },
    error:function (err) {
        console.log(err); 
        d.reject(err);
    }
  });
  return d.promise();
}

function parseAuth(data) {
  var lst = data.split('&'); 
  ACCESS_TOKEN = lst[1].split('=')[1];
  console.log(ACCESS_TOKEN);
  var userId = "116405140577765654998";
  //var url = "https://picasaweb.google.com/data/feed/api/user/"+userId+"?alt=json&access_token="+ ACCESS_TOKEN;

  getAlbumList().then(function(a){
   console.log(a);
  },function(err){
    console.log(err);
  });
}
