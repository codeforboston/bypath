'use strict';
angular.module('main')
.controller('DebugCtrl', function ($scope, $log,  Database) {

  $scope.data = {};

  // The difference between getObject and getObjectAll is
  // getObject allows you to specify which properties your wnat your returned
  // objects to have; while getObjectAll returns same data in pre-formatted structure
  // including all available properties.
  // Factory method Database.getObjectAll must be manually defined to sync with properites
  // made available through the back-end API 311 getter.
  // Database.getObject(['type', 'title'], function (data) {
  //     $scope.data.getObject = data;
  // });
  Database.getObjectAll(function (data) {
    // $log.log(data);
    $scope.data.getObjectAll = data;
  });

  Database.getItem('geo/311/101001731106', function(data){
    $scope.data.getItem = data;
  });

  /*Database.addNewItem({
        id:'12435',
        title:'Park',
        type: 'Unsafe',
        geo: '42,-71'
    });*/

  // Database.update('-KDpKJ8NIhM_BaxZBFmV', [{'path': 'type', 'value': 'snow'}, {'path': 'title', 'value': 'i will never change!!'}, {'path': 'pizza', 'value': 'pepperoni'}, {'path': 'description', 'value': 'encripstionsed!!!!'}]);



});
