'use strict';
angular.module('main')
.controller('ShowCtrl', function ($rootScope, $log, $filter, showResource, Ref, $firebaseObject, $firebaseArray, resourceObj, opinions, here) {

  $log.log('Hello from your Controller: ShowCtrl in module main:. This is your controller:', this);

  var showCtrl = this;

  showCtrl.resource = {};
  showCtrl.resource.type = showResource;

  showCtrl.data = {};

  // This demonstrates why it's important to have standardized data sets.
  // TODO: Standardize dem objects.
  if (showCtrl.resource.type === 'complaint') {

    var peanutGalleryRef = Ref.child('comments').child(resourceObj.id); // just id cuz its a 311 obj
    var comments = $firebaseArray(peanutGalleryRef);

    // Set title.
    showCtrl.resource.title = '311 Complaint';

    // Set resource to rootScope loaded 311s.
    showCtrl.data = $rootScope.threeoneones;

    // Set single resource.
    // http://stackoverflow.com/questions/19590063/get-specific-json-object-by-id-from-json-array-in-angularjs
    // showCtrl.resource.object = $filter('filter')(showCtrl.data, function (a) {return a.id == resourceId })
      //\\
      // $log.log(showCtrl.resource.object);
      $log.log(resourceObj);

    // Set description.
    showCtrl.resource.description = resourceObj.description;
    // Set icon.
    showCtrl.resource.icon = resourceObj.icon;
    // Set open dt
    showCtrl.resource.open_dt = resourceObj.open_dt;
    // Set closed dt
    showCtrl.resource.closed_dt = resourceObj.closed_dt;
    // Set location
    showCtrl.resource.location = resourceObj.location;
    // Set address
    showCtrl.resource.address = resourceObj.address;

  } else {

    var peanutGalleryRef = Ref.child('comments').child(resourceObj); // $id cuz its a firebase thingey
    var comments = $firebaseArray(peanutGalleryRef);

    // Set title.
    showCtrl.resource.title = 'Public Advisory';

    // Get firebase object.
    var complaintRef = Ref.child('opinions').child(resourceObj); // here is key, not obj...
    complaintRef.once('value', function (snap) {
      var data = snap.val();
      $log.log(data);
      // Set description.
      showCtrl.resource.description = data.text;
      // Set icon.
      // showCtrl.resource.icon = data.icon;
      // Set open dt
      showCtrl.resource.open_dt = data.time;
      // Set closed dt
      // showCtrl.resource.closed_dt = data.closed_dt;
      // Set location
      showCtrl.resource.location = data.location.coords;
      // Set address
      showCtrl.resource.address = data.location.address;
      // $log.log('data.image -> ', data.image);
      showCtrl.resource.image = data.image;

    });

  }

  showCtrl.peanuts = {};
  showCtrl.peanuts.comments = comments;
  showCtrl.peanuts.newComment = '';
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
