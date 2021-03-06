'use strict';

angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
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
    .state('main.parking', {
        url: '/parking',
        views:{
            'tab-parking': {
                templateUrl: 'main/templates/map.html',
                controller: 'ParkingCtrl as parkingCtrl'
            }
        }
    })
});