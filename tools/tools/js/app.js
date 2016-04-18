toolsApp = angular.module('toolsApp', ['ngResource', 'ngRoute'])
.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);