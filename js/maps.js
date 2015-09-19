var poi = new Array({lat: 51.508742, lng: -0.120850}, {lat: 49.508742, lng: -0.0});
var testCoordinate = new google.maps.LatLng(51.508742,-0.120850);
var map;
var bounds = new google.maps.LatLngBounds();

function initialize() {
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: testCoordinate,
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(mapCanvas, mapOptions);
}

function addMarkers(){
	for(var i = 0; i < poi.length; i++){
		var position = new google.maps.LatLng(poi[i].lat, poi[i].lng);
		bounds.extend(position);
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});
		console.log(poi[i]);
		console.log(marker);
		marker.setMap(map);
	}
	map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', addMarkers);

