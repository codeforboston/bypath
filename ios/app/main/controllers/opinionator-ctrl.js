'use strict';
angular.module('main')
.controller('OpinionatorCtrl', function ($scope, $log, Camera, Ref, $firebaseArray, Geolocation, Opinions, opinions) {

  $log.log('Hello from your Controller: OpinionatorCtrl in module main:. This is your controller:', this);

  // var opCtrl = this;
  $scope.opinions = opinions;

  $scope.msg = {};
  $scope.msg.text = '';
  $scope.where = {};

  $scope.where.position = location;


  // gettin imageable
  $scope.images = [];
  var syncArray = $firebaseArray(Ref.child('testImages'));
  $scope.images = syncArray;

  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
     console.log(imageURI);
     syncArray.$add({image: imageURI})
      .then(function () {
        alert("Image uploaded!");
      }, function (err) {
        $log.log("Error uploading image...");
      });
    }, function(err) {
     $log.log(err);
    });
  };

  $scope.addOpinion = function (message) {
    if (message.length > 0) {
      $scope.opinions.$add({
        id: Math.random().toString()
        , location: {
            address: $scope.where.address
            , coords: {
              latitude: $scope.where.position.coords.latitude
              , longitude: $scope.where.position.coords.longitude
            }
        }
        , text: message
                // Date.now()
        , time: Firebase.ServerValue.TIMESTAMP // <-- won't compile because the gulp eslinter is a hardarss bastard
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


  // Get location, then address, then format and show.
  Geolocation.get()
    .then(function gotLocation (position) {

      $scope.where.position = position;

      Geolocation.getNearByCity(position.coords.latitude, position.coords.longitude)
        .then(function (data) {
          $log.log(data);
          var formattedAddress = "";
          formattedAddress += data.data.results[0]['formatted_address'] // 49 Paulina St, Somerville, MA 02144, USA
          // formattedAddress += data.data.results[1]['address_components'][0]['short_name'] + ' '; // 443
          // formattedAddress += data.data.results[1]['address_components'][1]['short_name'] ; // Broadway
          // formattedAddress += ' in ';
          // formattedAddress += data.data.results[1]['address_components'][3]['short_name'] + ', ' ; // Cambridge
          // formattedAddress += data.data.results[1]['address_components'][5]['short_name'] ; // MA
          $scope.where.address = formattedAddress;
        },
        function (err) {
          $log.log(err);
        });
    }, function noLocation (err) {
      $log.log(err);
    });




});
