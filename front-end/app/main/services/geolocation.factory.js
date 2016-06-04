'use strict';

angular.module('main')

.factory('Geolocation', function($cordovaGeolocation, $log, $q, $http, Config) {

    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    /**
    * Sets the user position from the device.
    * Returns a promise containing the position.
    *
    * @param  {}
    * @return {Promise}
    */
    function getUserPosition() {
        $log.debug('Getting current location.');
        return $cordovaGeolocation.getCurrentPosition(options);
    };

    /**
    * Watches the user position from the device.
    * Returns a promise containing the position.
    *
    * @param  {}
    * @return {Promise}
    */
    function watchUserPosition() {
        $log.debug('Watch user location.');
        return $cordovaGeolocation.watchPosition(options);
    };

    /**
    * Gets nearby city for a given latitude and longitude.
    * Returns a promise for the location of a nearby city.
    *
    * @param  {Float, Float}
    * @return {Promise}
    */
    function getNearByCity(latitude, longitude) {
        $log.debug('Get nearby city.');
        var url = Config.ENV.GOOGLE_MAPS_API + '/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
        return $http({
            method: 'GET',
            url: url
        });
    }

    return {
        getUserPosition: getUserPosition,
        watchUserPosition: watchUserPosition,
        getNearByCity: getNearByCity
    };
});
