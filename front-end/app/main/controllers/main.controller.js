'use strict';

angular.module('main')

.controller('MainCtrl', function ($rootScope, $log, $timeout, MarkerFactory, Geolocation) {
    // The 311-s are *resolved* in main.js, which means they load before anything else.

    // Here, they've been passed in through the controller arg `threeoneones` and are
    // assigned to the $rootScope, which is, from what I can tell, just a badass version of
    // $scope which is availabe throughout the module.

    // This way, we only have to make the API call once, and the data is available anywhere
    // we want it in the app.
    var mainCtrl = this;

    $rootScope.space = {};
    // $rootScope.space.threeoneones = incidents;
});
