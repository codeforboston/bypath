'use strict';
angular.module('main')
.controller('TestShowCtrl', function ($scope, $log, $filter, Database, toos, objectId) {

  // data holster
  this.data = {};

  // parameterized objectId resolved through $stateParams in main.js
  this.data.objectId = objectId;

  // filter all toos for parameterized objectId
  this.data.obj = $filter('filter')(toos, {id: this.data.objectId})[0];

});
