toolsApp.controller("addParkingCtrl", function ($scope, $location,$http) {
    var header = ["address", "latitude", "longitude"];

    var address = $('#address');
    var lat = $('#lat');
    var lng = $('#lng');

    var table;

    $(document).ready(function(){
        table = $('#table').DataTable({
            columns: GenerateColumns()
        });
    });

    $('#add').click(function () {
        var result = {};
        result = {
            'address': address.val(),
            'latitude': lat.val(),
            'longitude': lng.val(),
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

    function GetTableContense(){
        var output = [];
        var length = table.rows().data().length;

        for(var i = 0; i < length; i++){

            output.push(table.rows(i).data()[0]);
        }
        
        return output;
    }

    function GenerateColumns(){
        var output = [];

        for (var i in header){
            var item = header[i];
            output.push({data: item});
        }

        return output;
    }
});