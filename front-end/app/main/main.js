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
        controller: 'MainCtrl as mainCtrl'
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
});

// Get address from GeoLocation factory.
function getAddress(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    return Geolocation.getNearByCity(latitude, longitude)
    .then(getLocationAndAddress(location));
}

// Get location and address object from given address.
function getLocationAndAddress(address, location) {
    var formatted_address = address.data.results[0]['formatted_address'];
    return {
        location: location,
        address: formatted_address
    };
}
