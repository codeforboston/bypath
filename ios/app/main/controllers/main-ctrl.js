'use strict';
angular.module('main')
.controller('MainCtrl', function ($rootScope, $log, $timeout, MarkerFactory, BuildAQuery, toos, ThreeOneOne, Geolocation) {

  // The 311-s are *resolved* in main.js, which means they load before anything else.
  // Here, they've been passed in through the controller arg `threeoneones` and are
  // assigned to the $rootScope, which is, from what I can tell, just a badass version of
  // $scope which is availabe throughout the module.
  // This way, we only have to make the API call once, and the data is available anywhere
  // we want it in the app.
  $rootScope.space = {};
  $rootScope.space.threeoneones = toos;

  var mainCtrl = this;
  mainCtrl.testes = 'work!';

  mainCtrl.testFilter = function () {
    var query = BuildAQuery.boston311Query(10, 'Closed', undefined, undefined);
    ThreeOneOne.getBoston311Data(query).then(function (data) {
      $rootScope.space.threeoneones = data;
    });
  };

  // $rootScope.location = {};
  // $rootScope.location.position = {};
  // $rootScope.location.address = '';

  // function setCurrentLocation (withAddress) {
  //   withAddress = typeof withAddress !== 'undefined' ? withAddress : false;
  //   Geolocation.get().then(function (loc) {

  //     if (withAddress) {
  //       $log.log('withAddress');
  //       Geolocation.getNearByCity(loc.coords.latitude, loc.coords.longitude).then(function (data) {
  //         $rootScope.location.position = loc; // geoposition object
  //         $rootScope.location.address = data.data.results[0]['formatted_address'];
  //       });
  //     } else {
  //       $log.log('with out Address');
  //       $rootScope.location.position = loc;
  //     }

  //   }, function (err) {
  //     $log.err(err);
  //   });
  // };
  // // setCurrentLocation(true);

  // // this should keep location updated. $timeout wraps the function in an $apply() so it should trigger $digest cycles.
  // // don't always query for address
  // $timeout(setCurrentLocation(), 1000);



  // Geolocation.get().then(function (loc) {
  //    = loc;
  // });
  // $rootScope.test = {};
  // Geolocation.get().then(function gotLoc (loc) {    $rootScope.$apply(function(){
  //       $rootScope.test.location = position;
  //     }); });

});
