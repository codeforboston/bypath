'use strict';
angular.module('main')
.controller('OpinionatorCtrl', function ($scope, $state, $cordovaCamera, $log, Ref, $firebaseArray, Geolocation, Opinions, opinions) { // CameraFactory

  $log.log('Hello from your Controller: OpinionatorCtrl in module main:. This is your controller:', this);

  // var opCtrl = this;
  $scope.opinions = opinions;

  $scope.msg = {};
  $scope.msg.text = '';
  $scope.where = {};

  $scope.where.position = location;


  $scope.where.image = 'none'; // default // FIXME: should be null or something
  $scope.where.image_src = 'data:image/jpeg;base64,' + $scope.where.image;
  // testing...
  // $scope.where.image = 'test';
  // $scope.where.image_src = 'main/assets/images/snowflake.png';

  // gettin imageable
  // $scope.images = [];
  // $scope.imagePath = '';

  // var syncArray = $firebaseArray(Ref.child('testImages'));
  // $scope.images = syncArray;

  // $scope.upload = function() {
  //         var options = {
  //             quality : 75,
  //             destinationType : Camera.DestinationType.DATA_URL,
  //             sourceType : Camera.PictureSourceType.CAMERA,
  //             allowEdit : true,
  //             encodingType: Camera.EncodingType.JPEG,
  //             popoverOptions: CameraPopoverOptions,
  //             targetWidth: 500,
  //             targetHeight: 500,
  //             saveToPhotoAlbum: false
  //         };
  //         $cordovaCamera.getPicture(options).then(function(imageData) {
  //             syncArray.$add({image: imageData}).then(function() {
  //                 alert("Image has been uploaded");
  //             });
  //         }, function(error) {
  //             console.error(error);
  //         });
  //     }

  $scope.takePhoto = function() {
    var options = {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 400,
        targetHeight: 400,
        saveToPhotoAlbum: false
    };

    // set image data (as base64) to scope
    $cordovaCamera.getPicture(options).then(function(imageData) {
        // syncArray.$add({image: imageData}).then(function() {
        //     alert("Image has been uploaded");
        // });
        $scope.where.image = imageData;

    }, function(error) {
        $log.log(error);
    });



    // var options = {
    //     quality : 75,
    //     targetWidth: 500,
    //     targetHeight: 500,
    //     saveToPhotoAlbum: false
    // };



    // CameraFactory.getPicture(options).then(function(imageURI) {

    //  $log.log(imageURI);
    //  $scope.where.image = imageURI;

    // //  syncArray.$add({image: imageURI})
    // //   .then(function () {
    // //     alert("Image uploaded!");
    // //   }, function (err) {
    // //     $log.log("Error uploading image...");
    // //   });
    // // }, function(err) {
    // //  $log.log(err);
    // // });
  };

  $scope.addOpinion = function (message) {
    if (message.length > 0) {
      $scope.opinions.$add({
        id: Math.random().toString().replace(/[.]/g, '')
        , location: {
            address: $scope.where.address
            , coords: {
              latitude: $scope.where.position.coords.latitude
              , longitude: $scope.where.position.coords.longitude
            }
        }
        , text: message
        , image: $scope.where.image || 'none' // eehhhhh. rather have null.

                // Date.now()
        , time: Firebase.ServerValue.TIMESTAMP // <-- won't compile because the gulp eslinter is a heartless bastard
      }, function (error) {
        $log.log('Error adding opinion.');
      })
      .then(function () {
        alert("Successfully added!");
        $scope.msg.text = '';
        $scope.where.image = 'none';
        // $state.go('main.listy');
        // if ($scope.where.image !== '') {

        //   var uploadOptions = {
        //     fileName:
        //   };

        //   uploadImage($scope.where.image);
        // }
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
