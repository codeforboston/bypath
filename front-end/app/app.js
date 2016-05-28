'use strict';

angular.module('ByPath', [
  'main'
])

.config(function($logProvider) {
    $logProvider.debugEnabled(false);
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});
