'use strict';
angular.module('main')

/**
 * Returns a GeoFire object.
 *
 * @return {GeoFire}
 */
.factory('Geo', ['Ref', function (Ref) {
    return new GeoFire(Ref.child('geo'));
}])

/**
 * Returns three functions that return location in various formats:
 *  1. String -> Object
 *  2. String -> Array
 *  3. Array -> String
 *
 * @return {3 functions}
 */
.factory('GeoFormatFactory', [function() {

    /**
    * Returns an object with named latitude and longitude properties.
    * Based on given location string.
    *
    * @param  {String}
    * @return {Object}
    */
    function parseLocationStringToNamedObject(locString) {
        var arr = locString.split(',');
        return {
            latitude: parseFloat(arr[0]),
            longitude: parseFloat(arr[1])
        };
    }

    /**
    * Returns a float array of size two - latitude and longitude.
    * Based on given location string - split by comma delimiter.
    *
    * @param  {String}
    * @return {Array}
    */
    function parseLocationStringToArray(locString) {
        var arr = locString.split(',');
        return [parseFloat(arr[0]), parseFloat(arr[1])];
    }

    /**
    * Returns a string - latitude and longitude delimited by a comma.
    * Based on given float array of size two.
    *
    * @param  {Array}
    * @return {String}
    */
    function parseLocationArrayToString(locArray) {
        if (locArray.length !== 2 || typeof locArray !== 'Array') {
            return 'Neeee!';
        } else {
            return locArray[0] + ',' + locArray[1];
        }
    }

    return {
        parseLocationStringToNamedObject: parseLocationStringToNamedObject,
        parseLocationStringToArray: parseLocationStringToArray,
        parseLocationArrayToString: parseLocationArrayToString
    };
}])

/**
 * Returns two functions that obtain the device location and nearby city:
 *  1. {} -> Promise
 *  2. Float, Float -> Promise
 *
 * @return {2 functions}
 */
.factory('Geolocation', function($cordovaGeolocation, $log, $q, $http) {
    /**
    * Returns a promise for the device location.
    * No parameters.
    *
    * @param  {}
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
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';
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
