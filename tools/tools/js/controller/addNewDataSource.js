toolsApp.controller("addNewDataSourceCtrl", function ($scope, $location) {
    
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
        
        result[name.val()] = {
            'url': url.val(),
            'key': key.val(),
            'query': query.val(),
            'map': {
                'id': id.val(),
                'title': title.val(),
                'type': type.val(),
                'location': location.val(),
                'open': open.val(),
                'latitude': latitude.val(),
                'longitude': longitude.val()
            }
        };
        
        var output = {};
        
        $.extend(output, tst, result);
        
        console.log(output);
        window.alert(JSON.stringify(output));
    });
});