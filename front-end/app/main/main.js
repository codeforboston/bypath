'use strict';

angular.module('firebase.config', [])
  .constant('FBURL', 'https://snowranger.firebaseio.com');

angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'firebase',
  'firebase.config',
  'leaflet-directive'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main/map');
    $stateProvider
    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/templates/tabs.html',
        controller: 'MainCtrl as mainCtrl',
        resolve: {
            // /**
            //  * @GeoLocation: GeoLocation factory
            //  * Returns --> userLocation()
            // */
            // userLocation: function(Geolocation) {
            //     return Geolocation.get()
            //     .then(getAddress);
            // },
            /**
            * @Database: Database factory
            * Return factory assembled objects based on getObjectAll() helper method
            */
            incidents: function(Database) {
                return Database.getObjectAll()
                .then(function(data) {
                    return Database.assembleObjects(data);
                });
            },
            /**
            * @Opinions: Opinions service
            * Return factory assembled objects based on getObjectAll() helper method
            */
            opinions: function(Opinions) {
                return Opinions.index();
            }
        }
    })
    .state('main.map', {
        url: '/map',
        views: {
            'tab-map': {
                templateUrl: 'main/templates/map.html',
                controller: 'MapCtrl as mapCtrl'
            }
        }
    })
    .state('main.list-detail', {
        url: 'mappydetail/:objectId',
        views: {
            'tab-mappy': {
                templateUrl: 'main/templates/list-detail.html',
                controller: 'TestShowCtrl as ctrl',
                resolve: {
                    objectId: function($stateParams) {
                        return $stateParams.objectId;
                    }
                }
            }
        }
    });
});

// Get address from GeoLocation factory.
function getAddress(location) {
    $log.log(location);
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    return Geolocation.getNearByCity(latitude, longitude)
    .then(getLocationAndAddress(location));
}

// Get location and address object from given address.
function getLocationAndAddress(address, location) {
    $log.log(address);
    $log.log(location);
    var formatted_address = address.data.results[0]['formatted_address'];
    return {
        location: location,
        address: formatted_address
    };
}
