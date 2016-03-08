'use strict';
angular.module('main')
.factory('Opinions', function ($log, Ref, $firebaseArray) {

  $log.log('Hello from your Service: Opinions in module main');

  var opinionsRef = Ref.child('opinions');
  var opinions = $firebaseArray(opinionsRef);

  return {
    index: function () {
      return opinions;
    }
  };

});
