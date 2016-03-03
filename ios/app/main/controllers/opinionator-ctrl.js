'use strict';
angular.module('main')
.controller('OpinionatorCtrl', function ($scope, $log, Geolocation, Opinions, opinions) {

  $log.log('Hello from your Controller: OpinionatorCtrl in module main:. This is your controller:', this);

  // var opCtrl = this;
  $scope.opinions = opinions;

  $scope.msg = '';
  // $scope.msg = {};
  // $scope.msg.text = '';

  $scope.where = {};

  $scope.addOpinion = function (message) {
    if (message.length > 0) {
      $scope.opinions.$add({
        location: $scope.where,
        text: message
      }, function (error) {
        $log.log('Error adding opinion.');
      })
      .then(function () {
        $scope.msg.text = '';
      }, function (err) {
        $log.log('error: ', err);
      });
    }

  };

  var getALock = function () {
    // Get location, then address, then format and show.
    Geolocation.get()
      .then(function gotLocation (position) {

        $scope.where = position;

        Geolocation.getNearByCity(position.coords.latitude, position.coords.longitude)
          .then(function (data) {
            $log.log(data);
            var formattedAddress = "";
            formattedAddress += data.data.results[1]['address_components'][0]['short_name'] + ' '; // 443
            formattedAddress += data.data.results[1]['address_components'][1]['short_name'] ; // Broadway
            formattedAddress += ' in ';
            formattedAddress += data.data.results[1]['address_components'][3]['short_name'] + ', ' ; // Cambridge
            formattedAddress += data.data.results[1]['address_components'][5]['short_name'] ; // MA
            $scope.isAt = formattedAddress;
          },
          function (err) {
            $log.log(err);
          });
      }, function noLocation (err) {
        $log.log(err);
      });
  };
  getALock();


});
