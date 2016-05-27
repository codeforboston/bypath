'use strict';
angular.module('Snowranger', [
  // load your modules here
  'main' // starting with the main module
]);

// Leaflet map puts tons of junk in the console window.
// You have to disable debug logging if you want to disable it
angular.module('Snowranger').config(['$logProvider',
    function($logProvider) {
        $logProvider.debugEnabled(false);
    }
]);
