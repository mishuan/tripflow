angular.module('tripFlow', []).controller('TripController',['$scope', function($scope) {

//Firebase
var myDataRef = new Firebase('https://shining-inferno-4500.firebaseio.com/');

var events = [];

//selected Events
$scope.selection = [];

//toggle selection for a given event by name
$scope.toggleSelection = function toggleSelection(event) {
  console.log(event);
  var idx = $scope.selection.indexOf(event);

  var pointOfInterest = {lat: event.place.location.latitude,
                         lng: event.place.location.longitude,
                         name: event.name};

  // is currently selected
  if (idx > -1) {
    $scope.selection.splice(idx, 1);
  }

  // is newly selected
  else {
    $scope.selection.push(pointOfInterest);
    //Draw the routes on the map.
    setData($scope.selection);
  }
};
//---------------------------------------------------

// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in t he documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(response => {
      statusChangeCallback(response);
    });
  }

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

  FB.getLoginStatus(response => {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    var user = {};

    FB.api("/me?fields=id,picture,name,events", function (response) {
        if (response && !response.error) {
          var name = response.name;
          var picture = response.picture.data.url;

          if (response.events) {
            var today = new Date(); //get today's date
            for (event of events) {
              if (event.place.location.latitude && event.place.location.longitude) {
                var startDate = new Date(event.start_time);
                if (startDate >= today) {
                  events.push(event);
                }
              }
            }
          }

          $scope.profileName = name;
          $scope.profilePicURL = picture;

          $scope.$apply(function () {
            $scope.events = events;
          });

          myDataRef.child(response.id).set({name: name, picture: picture, events: events});
        }
      }
    );
  }

  myDataRef.on('child_added', function(snapshot) {
    console.log(snapshot.val());
  });

}]);
