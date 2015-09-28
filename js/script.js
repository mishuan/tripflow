var city;

function addCity() {
  $('#accordion').show();
  var city = $('#cityInput').val();
  $('#cityName').html(city);
}

angular.module('tripFlow', []).controller('TripController',['$scope', function($scope) {

//Firebase
var myDataRef = new Firebase('https://shining-inferno-4500.firebaseio.com/');

var events = [];

//selected Events
$scope.selection = [];

//toggle selection for a given event by name
$scope.toggleSelection = function toggleSelection(event) {
  var pointOfInterest = {lat: event.place.location.latitude,
                         lng: event.place.location.longitude,
                         name: event.name};
  var idx = -1;
  if ($scope.selection) {
    for(var i = 0; i < $scope.selection.length; i++){
      if($scope.selection[i].name == pointOfInterest.name){
         console.log(pointOfInterest.name); 
         idx = i;
      }
    }
  }  
  // is currently selected
  if (idx != -1) 
    $scope.selection.splice(idx, 1);
  else 
    $scope.selection.push(pointOfInterest);
  
  setData($scope.selection);
};
//---------------------------------------------------

  function loginFb() {
    FB.login(function(response) {
     if (response.authResponse) {
       console.log('Welcome!  Fetching your information.... ');
       FB.api('/me', function(response) {
         console.log('Good to see you, ' + response.name + '.');
       });
       testAPI();
     } else {
       console.log('User cancelled login or did not fully authorize.');
     }
    }, {scope: 'public_profile,email,user_events,user_friends'});
  }

$scope.loginFb = loginFb;

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1614433488809128',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.4'
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login
  function testAPI() {
    var user = {};

    FB.api("/me?fields=id,picture,name,events", function (response) {
        if (response && !response.error) {
          var name = response.name;
          var picture = response.picture.data.url;

          console.log(response.events);

          if (response.events.data) {
            var today = new Date(); //get today's date
            for (var event of response.events.data) {
              if (event.start_time && event.place && event.place.location &&
                  event.place.location.latitude && event.place.location.longitude) {
                var startDate = new Date(event.start_time);
                if (startDate >= today) {
                  events.push(event);
                }
              }
            }
          }

          console.log(events);
          myDataRef.child(response.id).set({name: name, picture: picture, events: events});

          $scope.profileName = name;
          $scope.profilePicURL = picture;

          $scope.$apply(function () {
            $scope.events = events;
          });
        }
      }
    );
  }

  myDataRef.on('child_added', function(snapshot) {
    console.log(snapshot.val());
  });

}]);
