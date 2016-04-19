toolsApp = angular.module('toolsApp', ['ngResource', 'ngRoute'])
.config([
    '$compileProvider',
    function ($compileProvider) {
        // This is for allowing angular to bind to href for moving between views
        // Without it chrome makes the links as unsafe and will not link to anything
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);