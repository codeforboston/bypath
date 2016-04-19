toolsApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'mainPageCtrl'
    }).when('/dbRefresh', {
        templateUrl: 'views/dbRefresh.html',
        controller: 'dbRefreshCtrl'
    }).when('/addNewSource', {
        templateUrl: 'views/addNewDataSource.html',
        controller: 'addNewDataSourceCtrl'
    }).otherwise({
    redirectTo: '/'
    });
});