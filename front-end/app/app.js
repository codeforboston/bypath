'use strict';

angular.module('ByPath', [
  'main'
]);

angular.module('ByPath').config(['$logProvider',
    function($logProvider) {
        $logProvider.debugEnabled(false);
    }
]);
