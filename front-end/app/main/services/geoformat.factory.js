'use strict';

angular.module('main')

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
