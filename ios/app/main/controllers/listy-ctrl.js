'use strict';
angular.module('main')
.controller('ListyCtrl', function ($rootScope, $log) {

  var listyCtrl = this;

  // Root root resolution!
  listyCtrl.complaints = $rootScope.threeoneones;


});
