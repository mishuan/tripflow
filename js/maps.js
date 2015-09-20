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

// returns path depending on input
function urlConstructorTSP(){
	var coorLen = coordinate.length;
	// construct a url to server
	var url = "route/tsp_optimize/";
	url += coordinate[0].lat + "," + coordinate[0].lng;
	for(var i = 1; i < coordinate.length; i++)
		url += "+" + coordinate[i].lat + "," + coordinate[i].lng;	
	console.log(url);
	return url;
}

function search(){
	var url = "search/";
}

function genPath(data){
	console.log(data);
}

function TSP(){
	$.ajax({
		headers: {'Access-Control-Allow-Origin': '*'},
	    url: "http://localhost:4567/" + urlConstructorTSP(),
	    method: 'GET',
	    dataType: "json",
	    success: genPath
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
