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
  listyCtrl.data.complaints = toos;

  // listyCtrl.data.caseTypeFilter = {
  //   'Unsafe Dangerous Conditions': true,
  //   'Ground Maintenance': true
  // };

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





});
