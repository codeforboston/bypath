'use strict';
angular.module('main')
.controller('OpinionatorCtrl', function ($log, Geolocation) {

  $log.log('Hello from your Controller: OpinionatorCtrl in module main:. This is your controller:', this);

  var opCtrl = this;

  opCtrl.test = "yea!";

  // Get location, then address, then format and show.
  Geolocation.get()
    .then(function gotLocation (position) {
      Geolocation.getNearByCity(position.coords.latitude, position.coords.longitude)
        .then(function (data) {
          $log.log(data);
          var formattedAddress = "";
          formattedAddress += data.data.results[1]['address_components'][0]['short_name'] + ' '; // 443
          formattedAddress += data.data.results[1]['address_components'][1]['short_name'] ; // Broadway
          formattedAddress += ' in ';
          formattedAddress += data.data.results[1]['address_components'][3]['short_name'] + ', ' ; // Cambridge
          formattedAddress += data.data.results[1]['address_components'][5]['short_name'] ; // MA
          opCtrl.isAt = formattedAddress;
        },
        function (err) {
          $log.log(err);
        });
    }, function noLocation (err) {
      $log.log(err);
    });



});
