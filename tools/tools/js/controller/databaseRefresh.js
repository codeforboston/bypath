toolsApp.controller("dbRefreshCtrl", function ($scope, $location) {
    var modules = require('./js/api/util/modules.js');

    var dm = modules.getModule('data_manager');
    console.log(dm);
    console.log(dm.getEndpoints());
    //dm.forceUpdate();

    $('#refresh_button').click(function () {
        dm.forceUpdate();
    });
});