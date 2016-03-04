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
      resolve: {
        threeoneones: function (ThreeOneOne) {
          var query = ThreeOneOne.buildQuery(50, undefined, undefined);
          return ThreeOneOne.get311(query);
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
      .state('main.opinionDetailMappy', {
        url: 'map/opinion/:opinionId',
        views: {
          'tab-mappy': {
            templateUrl: 'main/templates/show.html',
            controller: 'ShowCtrl as showCtrl',
            resolve: {
              showResource: function () {
                return 'opinion';
              },
              resourceObj: function ($stateParams) {
                return $stateParams.opinionId;
              }
            }
          },
        }
      })
      .state('main.opinionDetailListy', {
        url: 'list/opinion/:opinionId',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/show.html',
            controller: 'ShowCtrl as showCtrl',
            resolve: {
              showResource: function () {
                return 'opinion';
              },
              resourceObj: function ($stateParams) {
                return $stateParams.opinionId;
              }
            }
          },
        }
      })
      .state('main.complaintDetailMappy', {
        url: 'map/complaint/:complaintId',
        views: {
          'tab-mappy': {
            templateUrl: 'main/templates/show.html',
            controller: 'ShowCtrl as showCtrl',
            resolve: {
              showResource: function () {
                return 'complaint';
              },
              resourceObj: function ($stateParams, $filter, threeoneones) {
                return $filter('filter')(threeoneones, function (a) {return a.id == $stateParams.complaintId })[0];
              }
            }
          },
        }
      })
      .state('main.complaintDetailListy', {
        url: 'list/complaint/:complaintId',
        views: {
          'tab-list': {
            templateUrl: 'main/templates/show.html',
            controller: 'ShowCtrl as showCtrl',
            resolve: {
              showResource: function () {
                return 'complaint';
              },
              resourceObj: function ($stateParams, $filter, threeoneones) {
                return $filter('filter')(threeoneones, function (a) {return a.id == $stateParams.complaintId })[0];
              }
            }
          },
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
