'use strict';
angular.module('main')

.factory('Geo', ['Ref', function (Ref) {
  return new GeoFire(Ref.child('geo'));
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
            defer.reject({ERROR: error});
          });
        }
      );
    return defer.promise;
  };

  // Accepts lat + lng, returns location json data from google.
  function getNearByCity (latitude, longitude){
      var defer = $q.defer();

      // fake cuz google started rejecting my api requests....
      defer.resolve({data: {
                        results: [{'formatted_address': 'here i am'}]
                    }});


      // var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';
      // $http({method: 'GET', url: url}).
      //   success(function(data, status, headers, config) {
      //        defer.resolve({data : data});
      //   }).
      //   error(function(data, status, headers, config) {
      //     defer.reject({error: 'City not found'});
      //   });
      return defer.promise;
  }

  return {
    get: get,
    getNearByCity: getNearByCity
  };
});
