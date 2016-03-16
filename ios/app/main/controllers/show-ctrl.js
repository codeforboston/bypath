'use strict';
angular.module('main')
.controller('ShowCtrl', function ($rootScope, $stateParams, $log, $filter, showResource, Ref, resourceId, $firebaseObject, $firebaseArray, opinions, here) {

  $log.log('Hello from your Controller: ShowCtrl in module main:. This is your controller:', this);

  var showCtrl = this;

  showCtrl.resource = {};
  showCtrl.resource.type = showResource;

  showCtrl.peanuts = {};


  showCtrl.peanuts.newComment = '';
  var commentsRef = Ref.child('comments').child(resourceId); // just id cuz its a 311 obj
  var comments = $firebaseArray(commentsRef);
  showCtrl.peanuts.comments = comments;

  if (showCtrl.resource.type === 'complaint') {
    showCtrl.resource.data = $firebaseObject(Ref.child('tooMaster').child(resourceId));
  }
  else {
    showCtrl.resource.data = $firebaseObject(Ref.child('opinions').child(resourceId));
  }

  // showCtrl.peanuts.location = here.
  showCtrl.addComment = function (message) {
    if (message.length > 0) {

      var loc = {
        latitude: here.location.coords.latitude,
        longitude: here.location.coords.longitude
      };

      showCtrl.peanuts.comments.$add({
        message: message,
        location: loc,
        address: here.address,
        time: Firebase.ServerValue.TIMESTAMP
      }).then(function (ref) {
        $log.log('Comment add at ' + ref.key());
        showCtrl.peanuts.newComment = '';
      }, function (err) {
        $log.err('Error adding comment', err);
      });
    } else {
      alert('Speak up! Youre mumbling');
    }
  };


});
