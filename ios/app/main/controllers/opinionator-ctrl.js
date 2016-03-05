'use strict';
angular.module('main')
.controller('OpinionatorCtrl', function ($q, $scope, $state, $cordovaCamera, $log, Ref, $firebaseArray, Geolocation, Opinions, opinions) { // CameraFactory

  $log.log('Hello from your Controller: OpinionatorCtrl in module main:. This is your controller:', this);

  // var opCtrl = this;
  $scope.opinions = opinions;

  $scope.msg = {};
  $scope.msg.text = '';
  $scope.where = {};

  // $scope.where.position = location;


  $scope.where.image = 'none'; // default // FIXME: should be null or something
  $scope.where.image_src = 'data:image/jpeg;base64,' + $scope.where.image;

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
  };

  $scope.addOpinion = function (message) {
    if (message.length > 0) {
      setLocation().then(function () {  // make sure location is updated
        $scope.opinions.$add({
          id: Math.random().toString().replace(/[.]/g, ''),
          location: {
              address: $scope.where.address
              , coords: {
                latitude: $scope.where.position.coords.latitude
                , longitude: $scope.where.position.coords.longitude
              }
          }
          , text: message
          , image: $scope.where.image || 'none' // eehhhhh. rather have null.
          , time: Firebase.ServerValue.TIMESTAMP // <-- won't compile with standard eslint because the gulp default eslinter is a heartless bastard. same with Camera
        }, function (error) {
          $log.log('Error adding opinion.');
        })
        .then(function (ref) {
          // alert("Successfully added!");
          $scope.msg.text = '';
          $scope.where.image = 'none';
          $state.go('main.opinionDetailListy', {opinionId: ref.key()});
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
      });
    }
  };


  // Get location, then address, then format and show.
  var setLocation = function () {
    // The promise won't return anything, but scope vars are set inline.
    var defer = $q.defer();
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
            defer.resolve();
          },
          function (err) {
            $log.log(err);
            var wasDeniedPermission = err.PERMISSION_DENIED ? 'Permission was denied.' : '';
            alert('There was an error retrieving your location...\n' + err.code + ': ' + err.message + '\n' + wasDeniedPermission);
            defer.reject(err);
          });
      }, function noLocation (err) {
        $log.log(err);
        var wasDeniedPermission = err.PERMISSION_DENIED ? 'Permission was denied.' : '';
        alert('There was an error retrieving your location...\n' + err.code + ': ' + err.message + '\n' + wasDeniedPermission);
        defer.reject(err);
      });

    return defer.promise;
  };
  setLocation(); // init - no .then() necessary. just sets up address





});
