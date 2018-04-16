
var mainMap;
var directionsService = new google.maps.DirectionsService();
var directionsRenderer= new google.maps.DirectionsRenderer();



var findLocation = function(){
  mainMap.geoLocate();
};


function postAjax(url, data, success) {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
    function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(params);
  return xhr;
}

var handleButtonClick = function(){
  var originInput = document.getElementById("origin");
  var destinationInput = document.getElementById("destination");
  var originPostcode = originInput.value;
  var destinationPostcode = destinationInput.value;
  console.log("input origin", originPostcode);
  console.log("input destination", destinationPostcode);
  var requestArray = [originPostcode, destinationPostcode];
  var requestedObject = {"postcodes": requestArray};
  var convertedRequestArray = JSON.stringify(requestedObject);
  postAjax('https://api.postcodes.io/postcodes', convertedRequestArray, function(data){
    var parsedData = JSON.parse(data);
    console.log(parsedData);
    calcNewRoute(parsedData);
  });
};

function calcNewRoute(data) {
  console.log("data", data);
  var newOrigin = {lat: data.result[0].result.latitude, lng: data.result[0].result.longitude};
  var newDestination = {lat: data.result[1].result.latitude, lng: data.result[1].result.longitude};
  console.log('calcNewRoute, newOrigin', newOrigin);
  console.log('calcNewRoute, newDestination', newDestination);


  var request = {
    origin: newOrigin,
    destination: newDestination,
    unitSystem: google.maps.UnitSystem.METRIC,
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      console.log(result.routes[0].legs[0].distance.value);
      directionsRenderer.setDirections(result);
      var pTag = document.querySelector("#distance");
      var calculatedDistance = (result.routes[0].legs[0].distance.value / 1.6) / 1000;
      const distanceDisplay = document.querySelector("#distance");
      distanceDisplay.innerText = "Calculated Distance: " + calculatedDistance + " miles.";
    }
  });
};

var initialize = function(){
  var origin = { lat: 55.824636, lng: -4.3419518 };
  var destination = { lat: 55.856158, lng: -4.2439485 };
  var mapDiv = document.getElementById('main-map');
  // var chicagoButton = document.querySelector('#chicago-button');
  // var whereAmIButton = document.querySelector('#geo-button');
  var center = { lat: 55.9533, lng: -4.5 };
  mainMap = new MapWrapper(mapDiv, center, 10);
  var calculateButton = document.getElementById("calculateButton");
  calculateButton.addEventListener('click', handleButtonClick);
  const distanceDisplay = document.querySelector("#distance");
  // mainMap.addMarker(center);
  mainMap.addClickEvent();
  mainMap.addInfoWindow(center, "Start spreadin' the news, I'm leavin' today <br>I want to be a part of it <br> <b>New York, New York</b>");
  directionsRenderer.setMap(mainMap.googleMap);

  function calcRoute(origin, destination) {
    var request = {
      origin: origin,
      destination: destination,
      unitSystem: google.maps.UnitSystem.METRIC,
      travelMode: google.maps.TravelMode.DRIVING
    }
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        console.log(result.routes[0].legs[0].distance.value);
        directionsRenderer.setDirections(result);
        var pTag = document.querySelector("#distance");
        var calculatedDistance = (result.routes[0].legs[0].distance.value / 1.6) / 1000;
        distanceDisplay.innerText = "Calculated Distance: " + calculatedDistance + " miles.";
      }
    });
  };

  calcRoute(origin, destination);
}

window.addEventListener('load', initialize);
