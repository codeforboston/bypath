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
