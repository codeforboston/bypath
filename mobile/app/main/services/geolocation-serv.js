'use strict';
angular.module('main')

.factory('Geo', ['Ref', function (Ref) {
  return new GeoFire(Ref.child('geo'));
}])


/**
 * @return {3 function}
 *
 * Our firebase stores geo data coordinates for complaints as a string like 72.112,-23.3992.
 * This factory returns two functions;
 *  1. String -> Obj, ie '42.32323,7123.123432' --> {lat: 42.32323, lon: 7123.123432}
 *  2. String -> Array
 *  3. Array to string. For storing.
 */
.factory('GeoFormatFactory', [function() {
  /**
   * @param  {String}
   * @return {Array}
   */
  function parseLocationStringToNamedObject(locString) {
    var arr = locString.split(',');
    return {
      latitude: parseFloat(arr[0]),
      longitude: parseFloat(arr[1])
    };
  }

  /**
   * @param  {String}
   * @return {Array}
   */
  function parseLocationStringToArray(locString) {
    var arr = locString.split(',');
    return [parseFloat(arr[0]),parseFloat(arr[1])];
  }

  /**
   * @param  {Array}
   * @return {String}
   */
  function parseLocationArrayToString(locArray) {
    if (locArray.length !== 2 || typeof locArray !== 'Array') {
      return 'Neeee!';
    } else {
      return locArray[0] + ',' + locArray[1]; // typeof == 'string'
    }
  }

  return {
    parseLocationStringToNamedObject: parseLocationStringToNamedObject,
    parseLocationStringToArray: parseLocationStringToArray,
    parseLocationArrayToString: parseLocationArrayToString
  };

}])


// Promise to get current user's geolocation and ( and we could set it in a userGeo ref)
.factory('Geolocation', function ($cordovaGeolocation, $log, $q, $http) {
  console.log('GeoLocate Factory reporting for duty.');

  // Calling GeoLocation.get() will attempt to get the current location of the
  // device in use.
  function get () {
    $log.log('Getting current location...');
    var defer = $q.defer();
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $cordovaGeolocation.getCurrentPosition(options)
      .then(
        function gotPositionCordova (position) { // Success.
          $log.log('Got location with Cordova:', position);
          defer.resolve(position); // Resolve position.
        },
        // Error.
        function (error) {
          // defer.reject({ERROR: error});
          // console.log('ERROR: ' + error);

          // No cordova? Let's try HTML5 for kicks.
          navigator.geolocation.getCurrentPosition(function gotPositionHTML (position) {
            $log.log('Got location with navigator:', position);
            defer.resolve(position);
          }, function noPositionHTML(err) {
            $log.log('Coudlnt get location at all');
            var position = {
                coords: {
                    accuracy: 70,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: 42.39137720000001,
                    longitude: -71.1473425,
                    speed: null
                },
                timestamp: 1463167968457
            }
            defer.resolve(position);
          });
        }
      );
    return defer.promise;
  };

  // Accepts lat + lng, returns location json data from google.
  function getNearByCity (latitude, longitude){
      var defer = $q.defer();

      // // fake cuz google started rejecting my api requests....
      // defer.resolve({data: {
      //                   results: [{'formatted_address': 'here i am'}]
      //               }});


      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';
      $http({method: 'GET', url: url}).
        success(function(data, status, headers, config) {
             defer.resolve({data : data});
        }).
        error(function(data, status, headers, config) {
          defer.reject({error: 'City not found'});
        });
      return defer.promise;
  }

  return {
    get: get,
    getNearByCity: getNearByCity
  };
});
