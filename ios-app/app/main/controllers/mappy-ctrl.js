'use strict';
angular.module('main')
.controller('MappyCtrl', function ($log, Geolocation) {
  //\\
  // $log.log('Hello from your Controller: MappyCtrl in module main:. This is your controller:', this);

  // Note that 'mappyCtrl' is also established in the routing in main.js.
  var mappyCtrl = this;

  // Defaults.
  mappyCtrl.zoom = 8;
  mappyCtrl.boston = { // This object is formatted to imitate the coords object from the geolocator.
    coords: {
      latitude: 42.4,
      longitude: -71.1
    }
  };

  var initializeMap = function (position) {
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
      disableDefaultUI: true
    };
  };

  var doMappery = function () {
    Geolocation.get()
      .then(function (position) { // Success.
        // Init map to current location as returned by the geolocator.
        initializeMap(position);
      },
      function (err) { // Error. Possibly/probably because it wasn't allowed.
        $log.log("Shit! (Maybe geolocation wasn't allowed?).\nError: ", err);

        // Set to map to center on default hardcoded position at about Boston.
        initializeMap(mappyCtrl.boston);
      });
  }

  // Initialize map to current location if allowed or hardcoded Boston if not.
  doMappery();

});
