'use strict';
angular.module('main')
.controller('ListyCtrl', function ($scope, $log, toos, opinions, here, Database, GeoFormatFactory) {

  var listyCtrl = this;

  // location resolved in main.js
  listyCtrl.currentLocation              = {};
  listyCtrl.currentLocation.location     = here.location.coords;
  listyCtrl.currentLocation.locArr       = [here.location.coords.latitude, here.location.coords.longitude];
  listyCtrl.currentLocation.address      = here.address;
  listyCtrl.currentLocation.test_img_src = 'main/assets/images/snowflake.png';

  // resources resolved in main.js
  listyCtrl.data = {};
  // Database.getObjectAll(function(data) {
  //   listyCtrl.data.complaints = data;
  // })
  listyCtrl.data.complaints = toos;
  // $log.log('toos', toos);
  //
  listyCtrl.data.caseTypeFilter = {
    'Unsafe Dangerous Conditions': true,
    'Ground Maintenance': true
  };

  // listyCtrl.data.opinions = opinions;

  // ui helpers
  listyCtrl.slideIndex = 0;
  listyCtrl.slideChanged = function(index) { // Called each time the slide changes.
    listyCtrl.slideIndex = index;
    setViewTitle(listyCtrl.slideIndex);
  };
  function setViewTitle (index) {
    if (index === 0) {
      listyCtrl.viewTitle = '311 Notices';
    } else {
      listyCtrl.viewTitle = 'Public Advisories';
    }
  }
  setViewTitle(0);

  // geoable
  listyCtrl.distanceToHere = function (locObj) {
    var a = parseFloat(locObj.coords.latitude);
    var b = parseFloat(locObj.coords.longitude);
    var locArr = [a,b];
    return GeoFire.distance(locArr, listyCtrl.currentLocation.locArr);
  };

  listyCtrl.testGeoMakingNamedObject = function (string) {
    return GeoFormatFactory.parseLocationStringToNamedObject(string);
  };

  listyCtrl.testGeoMakingArray = function (string) {
    return GeoFormatFactory.parseLocationStringToArray(string);
  };

  // out with the old without breaking thing in the ui
  listyCtrl.getComplaintUpvotes = function (id) {
    return 1; // deprecated
  };
  listyCtrl.getComplaintDownvotes = function (id) {
    return 1; // deprecated
  };

  listyCtrl.upvote = function (id) {
    // deprecated
  };

  listyCtrl.downvote = function (id) {
    // deprecated
  };



});
