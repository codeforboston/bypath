'use strict';
angular.module('main')
.controller('ShowCtrl', function ($rootScope, $log, $filter, showResource, Ref, $firebaseObject, resourceObj, opinions) {

  $log.log('Hello from your Controller: ShowCtrl in module main:. This is your controller:', this);

  var showCtrl = this;

  showCtrl.resource = {};
  showCtrl.resource.type = showResource;

  showCtrl.data = {};

  if (showCtrl.resource.type === 'complaint') {

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


});
