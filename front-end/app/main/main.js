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
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/templates/tabs.html',
        controller: 'MainCtrl as mainCtrl',
        // Resolve sets these vars as a dependency for the view and controller load, allowing
        // the vars to be injected into the controller just like a factory.
        resolve: {
            /**
             * @GeoLocation: GeoLocation factory
             * Returns --> here()
            */
            here: function(Geolocation) {
                return Geolocation.get()
                .then(function(location) {
                    // Retrieve lat / long pair from get() function.
                    var latitude = location.coords.latitude;
                    var longitude = location.coords.longitude;
                    return Geolocation.getNearByCity(latitude, longitude)
                    .then(function(address) {
                        // Retrieve formatted address from getNearByCity() function.
                        var formatted_address = address.data.results[0]['formatted_address']
                        return {
                            location: loc,
                            address: formatted_address
                        };
                    });
                });
            },
            /**
            * @Database: Database factory
            * Return factory assembled objects based on getObjectAll() helper method
            */
            toos: function(Database) {
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
