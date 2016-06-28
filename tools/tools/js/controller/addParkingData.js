toolsApp.controller("addParkingCtrl", function ($scope, $location) {
    var modules = require('./js/api/util/modules.js');
    //dm.forceUpdate();

    $('#refresh_button').click(function () {
        dm.forceUpdate();
    });
});