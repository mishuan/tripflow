var coordinate;
var center; 
var map;
var bounds = new google.maps.LatLngBounds();

function initialize() {
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: center,
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(mapCanvas, mapOptions);
}

function addMarkers(){
	for(var i = 0; i < coordinate.length; i++){
		var position = new google.maps.LatLng(coordinate[i].lat, coordinate[i].lng);
		bounds.extend(position);
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});
		marker.setMap(map);
	}
	map.fitBounds(bounds);
}

function destinationToCoor(){

}

// returns url if more than 1 destination
function urlConstructorTSP(){
	var url;
	var coorLen = coordinate.length;
	if(coorLen > 1){
		url = "https://maps.googleapis.com/maps/api/directions/json?";
		url += "origin=" + coordinate[0].lat + "," + coordinate[0].lng
				+ "&destination=" + coordinate[1].lat + "," + coordinate[1].lng
				+ "&waypoints=optimize:true";
		for(var i = 2; i < coordinate.length; i++)
			url += "|" + coordinate[i].lat + "," + coordinate[i].lng;	
		url += "&key=AIzaSyBiGE9sjCg4FtpySvRyMHSDroAN6Ysh5Do";
	}
	console.log(url);
	return url;
}

function genPath(data){
	console.log(data);
}

function TSP(){
	$.ajax({
	    url: "http://localhost:1337/" + urlConstructorTSP(),
	    type: 'GET',
	    dataType: "json",
	    success: genPath,
	    error: function(){ alert("failed"); }
	});
}

center = new google.maps.LatLng(43.653226,-79.3831843);
// temp testing data
//toronto, waterloo, thunder bay, london, buffalo
coordinate = new Array({lat: 43.653226, lng: -79.3831843}, 
				{lat: 43.4642578, lng: -80.5204096}, 
				{lat: 48.3808951, lng: -89.2476823},
				{lat: 42.9869502, lng: -81.243177},
				{lat: 42.8864467, lng: -78.8783689});

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', addMarkers);
TSP();
