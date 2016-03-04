'use strict';
angular.module('main')
.controller('MappyCtrl', function ($rootScope, $state, $log, Geolocation, opinions) {

  // Note that 'mappyCtrl' is also established in the routing in main.js.
  var mappyCtrl = this;
  mappyCtrl.thing = {};

  // Getting the threeoneones resolved in the main abstract controller.
  mappyCtrl.threeOneOneMarkers = $rootScope.threeoneones;
  // Set arbitrary ids for opinion markers
  mappyCtrl.opinionMarkers = opinions;



  // Defaults.
  mappyCtrl.zoom = 12;
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
      // control: {},
      // styles: mappyStyle,
      // markers: get311Markers(),
      options: {scrollwheel: false},
      disableDefaultUI: false,
      markersEvents311: {
        click: function(marker, eventName, model) {
          $log.log('Click marker');
          $log.log('model.id: ' + model.id);
          // var stateable = 'main.complaintDetail({complaintId: "' + model.id + '"})';
          $state.go('main.complaintDetailMappy', {complaintId: model.id});
          // mappyCtrl.map.infoIcon = model.icon;
          // mappyCtrl.map.infoDescription = model.description;
          // mappyCtrl.map.infoAddress = model.address;
        }
      },
      markersEventsOpinions: {
        click: function(marker, eventName, model) {
          $log.log('Click marker');
          var keyable = model.$id; // the angularfire key/id thingey (NOT model.id)
          $log.log('key: ' + keyable);
          // var stateable = 'main.opinionDetail({opinionId: "' + keyable + '"})';
          $state.go('main.opinionDetailMappy', {opinionId: keyable});
          // mappyCtrl.map.infoIcon = 'main/assets/images/snowflake-icon.png';
          // mappyCtrl.map.infoDescription = model.text;
          // mappyCtrl.map.infoAddress = model.location.address;
        }
      }
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

        // so we'll use Boston instead of current loc
        initializeMap(mappyCtrl.boston);
      });
  };
  getLocation();

  // var get311Markers = function () {
  //   ThreeOneOne.get311(complainables.GRIPES)
  //     .then(function got311 (markers) {
  //       $log.log(markers);

  //       // mappyCtrl.threeOneOneMarkers = markers;

  //       // This will check for availability of current location and then initialize the map with either the current loc or with default Boston.
  //       getLocation();
  //       // return markers;
  //     }, function failedGetting311 (err) {
  //       $log.log("Errrrrororrrr...", err);
  //     });
  // };

  // get311Markers();

});
