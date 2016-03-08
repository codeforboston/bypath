'use strict';
angular.module('main')
.controller('DebugCtrl', function ($scope, $window, $log, Main, complainables, threeoneones, ThreeOneOne) {

  $log.log('Hello from your Controller: DebugCtrl in module main:. This is your controller:', this);

  // var bug = this;


  $scope.test = {};
  $scope.test.cases = [];
  $scope.test.case_titles_json = complainables.ALL_CASE_TITLES;


  // ThreeOneOne.uniqueCases().then(function(data) {
  //   $log.log(data.data.length);
  //   // $scope.cases = data;
  //   $log.log('data', data.data);

  //   for (var i = 0; i < data.data.length; i ++) {
  //     var thing = {
  //       title: data.data[i].case_title,
  //       count: parseInt(data.data[i].count_case_title)
  //     };
  //     $scope.test.cases.push(thing);
  //     // $log.log(thing);
  //     // $log.log('$scope.cases', $scope.test.cases);
  //   };

  //   // angular.forEach(data, function (obj) {
  //   //   obj.count_int = parseInt(obj.count_case_title);
  //   // });
  //   // $scope.cases = data;
  // })

  // // bind data from services
  // this.someData = Main.someData;
  // this.ENV = Config.ENV;
  // this.BUILD = Config.BUILD;

  // // PASSWORD EXAMPLE
  // this.password = {
  //   input: '', // by user
  //   strength: ''
  // };
  // this.grade = function () {
  //   var size = this.password.input.length;
  //   if (size > 8) {
  //     this.password.strength = 'strong';
  //   } else if (size > 3) {
  //     this.password.strength = 'medium';
  //   } else {
  //     this.password.strength = 'weak';
  //   }
  // };
  // this.grade();

});
