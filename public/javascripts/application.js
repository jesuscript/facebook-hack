(function($){
  $(document).ready(function(){
    var friends;
    var mashed = {};

    $(".fb-login").click(function(e){
      e.preventDefault();
      var self = this;

      var randomInt = function(max){
        return Math.round(Math.random()*max);
      };

      var pickAtRandom = function(data){
        return data[randomInt(data.length - 1)];
      }

      var getPhoto = function(html_id,alb_id,usr_id){
        FB.api('/'+alb_id+'/photos', function(response){
          var src = pickAtRandom(response.data).source;
          $(html_id)
            .html($("<img />").attr("src",src))
            .attr("data-id",usr_id);
        });
      }

      var getAlbum = function(usr_id, html_id){
        FB.api('/'+usr_id+'/albums',function(response){
          if(response.data.length ===0){
            getAlbum(pickAtRandom(friends).id,html_id);
            return;
          }
          
          var alb_id = pickAtRandom(response.data).id;
          getPhoto(html_id, alb_id, usr_id);
        });
      };


      var refreshPhotos = function(){
        var id1, id2;
        var friends_to_avoid = {};

        id1 = pickAtRandom(friends).id;
        friends_to_avoid[id1] = 0;
        
        id2 = pickAtRandom(friends).id;

        getAlbum(id1,"#photo1");
        getAlbum(id2,"#photo2");
      }

      FB.login(function(response) {
        if (response.authResponse) {
          var access_token =   FB.getAuthResponse()['accessToken'];

          $(self).hide();

          FB.api('/me', function(response) {
            $(".my-username").text(response.first_name + " " +
                                   response.last_name);
          });

          FB.api('/me/picture', function(response){
            var $pic = $("<img />").attr("src", response.data.url); 
            $(".profile-pic-container").append($pic);
          });

          FB.api('/me/friends', function(response){
            friends = response.data;
            refreshPhotos();
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },{scope:"read_friendlists, user_photos, friends_photos"});

      $(".mash-pick").click(function(e){
        var self = this;
        e.preventDefault();

        $(".mash-pick").html("");
        
        var id = $(self).attr("data-id");

        if(mashed[id] === undefined){
          mashed[id] = 1;
        }else{
          mashed[id] +=1;
        }

        refreshPhotos();
      });


      $("#MASH").click(function(){
        var friends;
        $(".main").html("");

        for(var f in mashed){
          FB.api("/"+f,function(res){
            var fh = f;
            var name = res.first_name + " " + res.last_name;

            FB.api("/"+fh+"/picture",function(res){

              $(".main")
                .append($("<div></div>")
                        .append($("<img></img>").attr("src",res.data.url))
                        .append($("<span></span>").text(name))
                        .append($("<span></span>").text(" (" + mashed[f] + ")")));
            });
          });
        }

      });
    });
  });
})(jQuery);