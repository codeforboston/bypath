'use strict';

angular.module('firebase.config', [])
  .constant('FBURL', 'https://snowranger.firebaseio.com');

angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'firebase',
  'firebase.config',
  'uiGmapgoogle-maps',
  'leaflet-directive'
  // TODO: load other modules selected during generation
])
// for the camera
// http://learn.ionicframework.com/formulas/cordova-camera/
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data):/); // data is safe!
})
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/mappy');
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
         * Returns -->
         *   // here: {
             //   location: {
             //     coords: {
               // altitude: null
               // altitudeAccuracy: null
               // heading: null
               // latitude: 42.40128642893472
               // longitude: -71.12408442000427
               // speed: null
             //   },
             //   address: '47 paulina st stomervilel'
             // }
         */
        here: function (Geolocation) {
          return Geolocation.get().then(function(loc) {
            return Geolocation.getNearByCity(loc.coords.latitude, loc.coords.longitude).then(function (add) {
              return {location: loc, address: add.data.results[0]['formatted_address']};
            });
          });
        },
        /**
         * @Database: Database factory
         * return factory assembled objects based on getObjectAll() helper method
         */
        toos: function (Database) {
          return Database.getObjectAll().then(function(data) {
            return Database.assembleObjects(data);
          });
        },
        opinions: function (Opinions) {
          return Opinions.index();
        }
      }
    })
      // .state('main.debug', {
      //   url: '/debug',
      //   views: {
      //     'tab-debug': {
      //       templateUrl: 'main/templates/debug.html',
      //       controller: 'DebugCtrl'
      //     }
      //   }
      // })
      .state('main.mappy', {
        url: '/mappy',
        views: {
          'tab-map': {
            templateUrl: 'main/templates/mappy.html',
            controller: 'MappyCtrl as mappyCtrl'
          }
        }
      })
      .state('main.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/list2.html',
            controller: 'ListyCtrl as listyCtrl'
          }
        }
      })
      // .state('main.mappy', {
      //   url: '/mappy',
      //   controller: 'MappyCtrl as mappyCtrl',
      //   views: {
      //     'tab-mappy': {
      //       templateUrl: 'main/templates/mappy.html'

      //     },
      //     'tab-list': {
      //       templateUrl: 'main/templates/list2.html'
      //       // controller: 'MappyCtrl as mappyCtrl'
      //     }
      //   }
      // })
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
      })
      // .state('main.opinionate', {
      //   url: '/opinionate',
      //   views: {
      //     'tab-opinionate': {
      //       templateUrl: 'main/templates/opinionator.html',
      //       controller: 'OpinionatorCtrl'
      //     }
      //   }
      // })
      ;
});
