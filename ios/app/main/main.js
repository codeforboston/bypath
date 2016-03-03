'use strict';

angular.module('firebase.config', [])
  .constant('FBURL', 'https://snowranger.firebaseio.com');

angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'firebase',
  'firebase.config',
  'uiGmapgoogle-maps'

  // TODO: load other modules selected during generation
])
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
      resolve: {
        threeoneones: function (ThreeOneOne, complainables) {
          return ThreeOneOne.get311(complainables.GRIPES);
        },
        opinions: function (Opinions) {
          return Opinions.index();
        }
      }
    })
      .state('main.list', {
        url: '/list',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/list.html',
            controller: 'ListyCtrl as listyCtrl'
          }
        }
      })
      .state('main.listDetail', {
        url: '/list/detail',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/list-detail.html',
            // controller: 'SomeCtrl as ctrl'
          }
        }
      })
      .state('main.debug', {
        url: '/debug',
        views: {
          'tab-debug': {
            templateUrl: 'main/templates/debug.html',
            controller: 'DebugCtrl as ctrl'
          }
        }
      })
      .state('main.mappy', {
        url: '/mappy',
        views: {
          'tab-mappy': {
            templateUrl: 'main/templates/mappy.html',
            controller: 'MappyCtrl as mappyCtrl'
          }
        }
      })
      .state('main.opinionate', {
        url: '/opinionate',
        views: {
          'tab-opinionate': {
            templateUrl: 'main/templates/opinionator.html',
            controller: 'OpinionatorCtrl'
          }
        }
      })
      ;
});
