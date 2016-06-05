'use strict';

angular.module('ByPath', [
  'main'
])

.config(function($logProvider) {
    $logProvider.debugEnabled(true);
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});
