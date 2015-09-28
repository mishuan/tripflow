var coordinate;
var map;
var bounds = new google.maps.LatLngBounds();
var directionsDisplay;
var directionsService;
var directionsDisplay;


function initialize() {
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: new google.maps.LatLng(43.653226,-79.3831843),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(mapCanvas, mapOptions);
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);

function clearMarkers() {
  markers.forEach(function(marker) {
    marker.setMap(null);
  })
  markers = [];
  total = 0;
}

markers = []
function addMarkers(){
	clearMarkers();
	for(var i = 0; i < coordinate.length; i++){
		bounds.extend(new google.maps.LatLng(coordinate[i].lat, coordinate[i].lng));
		var marker = new google.maps.Marker({
			position: {lat:coordinate[i].lat, lng:coordinate[i].lng},
			map: map
		});
		marker.setMap(map);
		markers.push(marker);
	}
	map.fitBounds(bounds);
}

function urlConstructor(){
	var coorLen = coordinate.length;
	// construct a url to server
	var url = coordinate[0].lat + "," + coordinate[0].lng;
	for(var i = 1; i < coordinate.length; i++)
		url += "+" + coordinate[i].lat + "," + coordinate[i].lng;	
	return url;
}
var path;
function genPath(data){
	console.log(data);
	if(path)
		path.setMap(null);
	var latlng = []
	for(var i = 0; i < data.length; i++)
		latlng.push(data[i].start_location);
		path = new google.maps.Polyline({
		    path: latlng,
		    geodesic: true,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
	  	});
  	path.setMap(map);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, optimize) {
  var waypts = [];
  for (var i = 1; i < coordinate.length-1; i++) {
      waypts.push({
        location: new google.maps.LatLng(coordinate[i].lat,coordinate[i].lng),
        stopover: true
      });
  }

  directionsService.route({
    origin: new google.maps.LatLng(coordinate[0].lat,coordinate[0].lng),
    destination: new google.maps.LatLng(coordinate[coordinate.length-1].lat,coordinate[coordinate.length-1].lng),
    waypoints: waypts,
    optimizeWaypoints: optimize,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      console.log(response);
      console.log(directionsDisplay);

    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function calcRoute(optimize){
	calculateAndDisplayRoute(directionsService, directionsDisplay, optimize);
}

function TSP(){
	$.ajax({
		headers: {'Access-Control-Allow-Origin': '*'},
	    url: "http://localhost:4567/route/tsp_optimize/" + urlConstructor(),
	    method: 'GET',
	    dataType: "json",
	    success: genPath
	});
}

function normalRoute(){
	$.ajax({
		headers: {'Access-Control-Allow-Origin': '*'},
	    url: "http://localhost:4567/route/generate/" + urlConstructor(),
	    method: 'GET',
	    dataType: "json",
	    success: genPath
	});
}

var yelpResult

function yelpSearch(location, term) {
	$.ajax({
		headers: {'Access-Control-Allow-Origin': '*'},
	    url: "http://localhost:4567/yelp/poi/" + location + "/" + term,
	    method: 'GET',
	    dataType: "json",
	    success: function(data) {
	    	yelpResult = data;
	    }
	});
}

function setData(data, optimize){
	coordinate = data;
	addMarkers();
  if (data.length > 1) {
	  calcRoute(optimize);
  }
}


//data = new Array({lat: 43.653226, lng: -79.3831843}, {lat: 43.4642578, lng: -80.5204096}, {lat: 48.3808951, lng: -89.2476823},{lat: 42.9869502, lng: -81.243177},{lat: 42.8864467, lng: -78.8783689});
