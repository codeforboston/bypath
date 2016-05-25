toolsApp.controller("addNewDataSourceCtrl", function ($scope) {
    var modules = require('./js/api/util/modules.js');
    var request = require('request');

    var name = $('#name');
    var url = $('#url');
    var key = $('#key');
    var query = $('#query');
    
    var id = $('#id');
    var title = $('#title');
    var type = $('#type');
    var location = $('#location');
    var open = $('#open');
    var latitude = $('#latitude');
    var longitude = $('#longitude');
    
    var tst = {'help': 'me', 'do': 'something'}

    $('#add_new_source').click(function () {
        var result = {};
        
        result = {
            'name': name.val(),
            'url': url.val(),
            'key': key.val(),
            'query': query.val(),
            'id': id.val(),
            'title': title.val(),
            'type': type.val(),
            'location': location.val(),
            'open': open.val(),
            'latitude': latitude.val(),
            'longitude': longitude.val()
        };
        
        var rm = modules.getModule('resource_manager');
        var call_url = rm.getResource('server_url') + rm.getResource('addEndpoint_path');

        $.post(call_url, result).done(function (data) { console.log("data loaded: " + data);});
    });
});