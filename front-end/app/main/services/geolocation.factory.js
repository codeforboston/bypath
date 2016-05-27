'use strict';

angular.module('main')

/**
 * Returns two functions that obtain the device location and nearby city:
 *  1. {} -> Promise
 *  2. Float, Float -> Promise
 *
 * @return {2 functions}
 */
.factory('Geolocation', function($cordovaGeolocation, $log, $q, $http, Config) {
    /**
    * Returns a promise for the device location.
    * No parameters.
    *
    * @param  {Function, Function}
    * @return {}
    */
    function getUserPosition(successCallback, failureCallback) {
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $log.log('Getting current location.');
        $cordovaGeolocation.getCurrentPosition(options)
        .then(successCallback, failureCallback);
    };

    /**
    * Returns a promise for the location of a nearby city.
    * Based on two given float values - latitude and longitude.
    *
    * @param  {Float, Float}
    * @return {Promise}
    */
    function getNearByCity(latitude, longitude) {
        var defer = $q.defer();
        var url = Config.ENV.GOOGLE_MAPS_API + '/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';
        $http({
            method: 'GET',
            url: url
        })
        .success(function(data, status, headers, config) {
            defer.resolve({data : data});
        })
        .error(function(data, status, headers, config) {
            defer.reject({error: 'City not found'});
        });

        return defer.promise;
    }

    return {
        getUserPosition: getUserPosition,
        getNearByCity: getNearByCity
    };
});
