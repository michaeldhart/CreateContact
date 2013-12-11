var Gmaps = {
  geocoder: {},
  map: {}
};

Gmaps.initialize = function() {
    Gmaps.geocoder = new google.maps.Geocoder();
    var mapOptions = {
      center: new google.maps.LatLng(42.451, -89.064),
      zoom: 16
    };
    Gmaps.map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
  }

Gmaps.codeAddress = function(address) {
    Gmaps.geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        Gmaps.map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: Gmaps.map,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }