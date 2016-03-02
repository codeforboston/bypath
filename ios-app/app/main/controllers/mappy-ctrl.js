'use strict';
angular.module('main')
.controller('MappyCtrl', function ($log, Geolocation, ThreeOneOne) {

  // Note that 'mappyCtrl' is also established in the routing in main.js.
  var mappyCtrl = this;

  // Defaults.
  mappyCtrl.zoom = 10;
  mappyCtrl.boston = { // This object is formatted to imitate the coords object from the geolocator.
    coords: {
      latitude: 42.4,
      longitude: -71.1
    }
  };
  mappyCtrl.complaintTypes = [
    'Ground Maintenance'
    , 'Request for Snow Plowing'
    , 'Park Maintenance'
    , 'Unsafe/Dangerous Conditions'
    // , 'Metrolist Survey'
  ];

  // Tests.
  // $log.log('Hello from your Controller: MappyCtrl in module main:. This is your controller:', this);
  // var test = ThreeOneOne.get311(mappyCtrl.complaintTypes);
  // $log.log(test);

  var initializeMap = function (position, markers) {
    //\\
    // $log.log('initializeMap position -> ', position);

    // Create the Google Map
    mappyCtrl.map = {
      center: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      zoom: mappyCtrl.zoom,
      // bounds: '',
      // bounds="mappyCtrl.map.bounds"
      // control: {},
      // styles: mappyStyle,
      options: {scrollwheel: false},
      disableDefaultUI: false
    };
  };

  var getLocation = function () {
    Geolocation.get()
      .then(function (position) { // Success.
        // return position
        initializeMap(position);
      },
      function (err) { // Error. Possibly/probably because it wasn't allowed.
        $log.log("Shit! (Maybe geolocation wasn't allowed?).\nError: ", err);
        // return err;
        // return mappyCtrl.boston;
        initializeMap(mappyCtrl.boston);
      });
  };

  function matchIcon (obj) {
    var b = '';
    switch (obj.description) {
      case 'Ground Maintenance' : b = 'main/assets/images/danger-hump.png'; break;
      case 'Request for Snow Plowing' : b = 'main/assets/images/snow_plow_truck.png'; break;
      case 'Park Maintenance' : b = 'main/b = assets/images/lawnmower.png'; break;
      case 'Unsafe/Dangerous Conditions' : b = 'main/assets/images/falling-person.png'; break;
    };
    return b;
  };

  function setIcons (objArray) {
    var dataWithIcons = [];

    for (var i = 0; i < objArray.length; i++) {
      var a = objArray[i];
      a.icon = matchIcon(a);
      dataWithIcons.push(a);
    }

    return dataWithIcons;
  };


  var markerArray311 = function () {
    ThreeOneOne.get311(mappyCtrl.complaintTypes)
      .then(function got311 (data) {
        $log.log(data);

        var markers = setIcons(data);

        mappyCtrl.threeOneOneMarkers = markers;
        getLocation();
      }, function failedGetting311 (err) {
        $log.log("Errrrrororrrr...", err);
      });
  };


  markerArray311();

});
