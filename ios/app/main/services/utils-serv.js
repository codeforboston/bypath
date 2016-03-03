'use strict';
angular.module('main')

.factory('Ref', ['$window', 'FBURL', function($window, FBURL) {
  return new $window.Firebase(FBURL);
}])


// http://learn.ionicframework.com/formulas/cordova-camera/
.factory('Camera', ['$q', function($q) {

   var options = {
       quality : 75,
       // destinationType : Camera.DestinationType.DATA_URL,
       // sourceType : Camera.PictureSourceType.CAMERA,
       // allowEdit : true,
       // encodingType: Camera.EncodingType.JPEG,
       // popoverOptions: CameraPopoverOptions,
       targetWidth: 500,
       targetHeight: 500,
       saveToPhotoAlbum: false
   };

  var getPicture = function(options) {
   var q = $q.defer();

   navigator.camera.getPicture(function(result) {
     // Do any magic you need
     q.resolve(result);
   }, function(err) {
     q.reject(err);
   }, options);

   return q.promise;
  };

  return {
    getPicture: getPicture
  };

  // $scope.uploadPicture = function() {
  //        var options = {
  //            quality : 75,
  //            destinationType : Camera.DestinationType.DATA_URL,
  //            sourceType : Camera.PictureSourceType.CAMERA,
  //            allowEdit : true,
  //            encodingType: Camera.EncodingType.JPEG,
  //            popoverOptions: CameraPopoverOptions,
  //            targetWidth: 500,
  //            targetHeight: 500,
  //            saveToPhotoAlbum: false
  //        };
  //        $cordovaCamera.getPicture(options).then(function(imageData) {
  //            syncArray.$add({image: imageData}).then(function() {
  //                alert("Image has been uploaded");
  //            });
  //        }, function(error) {
  //            console.error(error);
  //        });
  //    }

}])

.factory('Utils', function ($log) {

  $log.log('Hello from your Service: Utils in module main');

  function matchIcon (obj) {
    var desc = obj.description;
    var icon_path = '';

    var groundy = /ground/i;
    var snowy = /snow/i;
    var parky = /park/i;
    var dangery = /danger/i;

    if (desc.match(groundy)) {
      icon_path = 'main/assets/images/danger-hump.png';
    }
    else if (desc.match(snowy)) {
      icon_path = 'main/assets/images/snow_plow_truck.png';
    }
    else if (desc.match(parky)) {
      icon_path = 'main/assets/images/lawnmower.png';
    }
    else if (desc.match(dangery)) {
      icon_path = 'main/assets/images/falling-person.png';
    }
    else {
      icon_path = 'main/assets/images/snowflake-icon.png';
    }
    return icon_path;
  };

  var setIcons = function (objArray) {
    var dataWithIcons = [];

    for (var i = 0; i < objArray.length; i++) {
      var a = objArray[i];
      a.icon = matchIcon(a);
      dataWithIcons.push(a);
    }

    return dataWithIcons;
  };

  return {
    setIcons: setIcons
  };

});
