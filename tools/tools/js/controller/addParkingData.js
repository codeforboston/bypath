toolsApp.controller("addParkingCtrl", function ($scope, $location,$http) {

    var address = $('#address');
    var lat = $('#lat');
    var lng = $('#lng');
    var url = $('#url');

    var table;

    var columnsDef = [{
        "sTitle": "Address",
            "mData": "address",
            "aTargets": [0]
    }, {
        "sTitle": "Latitude",
            "mData": "latitude",
            "aTargets": [1]
    }, {
        "sTitle": "Longitude",
            "mData": "longitude",
            "aTargets": [2]
    }  ];

    $(document).ready(function(){
        table = $('#table').DataTable({
            "aoColumnDefs":columnsDef
        });
    });

    $('#add').click(function () {
        var result = {};
        result = {
            'address': address.val(),
            'latitude': lat.val(),
            'longitude': lng.val()
        }
        table.rows.add([result]).draw();
    });

    $('#submit').click(function(){
        var items = GetTableContense();
        var call_url = "http://localhost:8080/parking/add";
        
        if(items.length > 0){
            console.log("Sending items to " + call_url);
            console.log(items);

            var jsonData=angular.toJson(items);
            var objectToSerialize={'object':jsonData};

            $http({
                url: call_url,
                method: "POST",
                data: $.param(objectToSerialize),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });

            //$.post(call_url, items).done(function (data) { console.log("data loaded: " + data);});
        }
        else{
            console.log("Not enough data. Only " + items.length + " items in the array");
        }

    });

    $('#connect').click(function () {
        var stmnt = url.val();//'https://data.cambridgema.gov/resource/t8h9-i4u2.json?$query=SELECT * LIMIT 10';
        var key = 'k7chiGNz0GPFKd4dS03IEfKuE';

        $http({
                url: stmnt,
                method: "GET",
                headers: {
                'X-App-Token': key
                }
        }).then(function(response) {
            var data = response['data'];

            var output = [];

            for(i in data){
                var lat = data[i]['latitude'];
                var lng = data[i]['longitude'];
                var address = data[i]['street_number'] + " " + data[i]['location_address'];
                
                result = {
                    'address': address,
                    'latitude': lat,
                    'longitude': lng
                }
                output.push(result);
            }

            table.rows.add(output).draw();
        });
    });

    function GetTableContense(){
        var output = [];
        var length = table.rows().data().length;

        for(var i = 0; i < length; i++){

            output.push(table.rows(i).data()[0]);
        }
        
        return output;
    }
});