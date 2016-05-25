'use strict';

angular.module('ByPath', [
  'main'
]);

// Leaflet map puts tons of junk in the console window.
// You have to disable debug logging if you want to disable it
angular.module('ByPath').config(['$logProvider',
    function($logProvider) {
        $logProvider.debugEnabled(false);
    }
]);
