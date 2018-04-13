


var initialize = function(){
  var mapDiv = document.getElementById('main-map');
  // var chicagoButton = document.querySelector('#chicago-button');
  var whereAmIButton = document.querySelector('#geo-button');

  var center = { lat: 55.9533, lng: -4.5 };

  var mainMap = new MapWrapper(mapDiv, center, 10);
  // mainMap.addMarker(center);
  mainMap.addClickEvent();
  mainMap.addInfoWindow(center, "Start spreadin' the news, I'm leavin' today <br>I want to be a part of it <br> <b>New York, New York</b>");


    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer= new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(mainMap.googleMap);

    function calcRoute() {
      // var start = document.getElementById('start').value;
      // var end = document.getElementById('end').value;
      var request = {
          origin: { lat: 55.824636, lng: -4.3419518 },
          destination: { lat: 55.856158, lng: -4.2439485 },
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          travelMode: google.maps.TravelMode.DRIVING
        }
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          console.log(result.routes[0].legs[0].distance.value);
          // alert(response.routes[0].legs[0].distance.value);
          directionsRenderer.setDirections(result);
        }
      });
    }

  //   var goToChicago = function(){
  //     var chicago = { lat: 41.878114, lng: -87.629798 };
  //     mainMap.googleMap.setCenter(chicago);
  //     mainMap.addInfoWindow(chicago, "<h3>Chicago</h3>");
  //   }
  //
  var findLocation = function(){
    mainMap.geoLocate();
  }
  //
  // chicagoButton.addEventListener('click', goToChicago);
  whereAmIButton.addEventListener('click', findLocation);
  calcRoute();
}

window.addEventListener('load', initialize);
