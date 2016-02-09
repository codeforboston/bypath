/*
                             
     _______ _______ _______ 
    |\     /|\     /|\     /|
    | +---+ | +---+ | +---+ |
    | |   | | |   | | |   | |
    | |3  | | |1  | | |1  | |
    | +---+ | +---+ | +---+ |
    |/_____\|/_____\|/_____\|
                             
*/

var complaintTypes = {
    
    // 'PWD Graffiti': '/static/img/graffiti-icon.png',
    // 'Graffiti Removal': '/static/img/graffiti-icon.png',

    // 'Ground Maintenance' : '/static/img/danger-hump.png',
    
    // these are (mostly) redundant to snow plowing, but not 1:1
    // (all snowplowing -> sidewalk repair, but not all sidewalk repair -> snowplowing)
    'Sidewalk Repair' : '/static/img/danger-hump.png',
    
    // there aren't many of these open
    'Park Maintenace' : '/static/img/lawnmower.png',
    'Unsafe/Dangerous Conditions' : '/static/img/falling-person.png',
    
    'Request for Snow Plowing': '/static/img/snow_plow_truck.png'
};

// 311 image urls for different complaint types. 
// var snowPlowImageUrl = '/static/img/snow_plow_truck.png'


var getBoston311Data = function(complaintType, complaintImageUrl) {
    console.log('complaintType -> ' + complaintTypes + ', ' + 'complaintImage -> ' + complaintImageUrl);
    var bostonUrl = 'https://data.cityofboston.gov/resource/wc8w-nujj.json';

    // Get 311 data and add markers for all complaint types. 
    for (var type in complaintTypes) {
      if (complaintTypes.hasOwnProperty(type)) {
        // console.log(type, complaintTypes[type]);
        doAjax(type, complaintTypes[type]);
      }
    }
    function doAjax(complaintType, complaintImageUrl) {
        // Retrieve relevant data from Boston 311 API
        $.ajax({
            url: bostonUrl,
            method: 'GET',
            headers: {
                'X-App-Token': 'k7chiGNz0GPFKd4dS03IEfKuE'
            },
            data: {
                '$query': "SELECT * WHERE open_dt > '2016-01-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(type, '" + complaintType + "')" // Rodent Activity // Request for Snow Plowing // Bed Bugs // Abandoned Building // Overcrowding
            },
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var loc = {
                        latitude: data[i].latitude,
                        longitude: data[i].longitude
                    };
                    boston311MarkerInfos.push({
                        description: data[i].case_title,
                        location: loc,
                        address: data[i].location
                    });
                }
            },
            error: function(data) {
                alert("Couldn't retrieve data from Boston SODA API");
            }
        }).done(function() {

            infowindow = new google.maps.InfoWindow({
                content: "holding..."
            });

            for (index in boston311MarkerInfos) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(boston311MarkerInfos[index].location.latitude), parseFloat(boston311MarkerInfos[index].location.longitude)),
                    map: map,
                    title: "Boston 311 Incident",
                    icon: complaintImageUrl
                });

                infowindow = new google.maps.InfoWindow({
                    content: "<div>" +
                        "<p><b>" + boston311MarkerInfos[index].description + "</b></p><br>" +
                        "<p>" + boston311MarkerInfos[index].address + "</p>" +
                        "<p>" + "(Source: Boston 311)" + "</p>" +
                        "</div>"
                });

                google.maps.event.addListener(marker, 'click', (function(marker, infowindow) {
                    return function() {
                        infowindow.open(map, this);
                    };
                })(marker, infowindow));

                // FIXME? Click anywhere on map to close open infowindow.
                // google.maps.event.addListener(map, 'click', function() {
                //     infowindow.close();
                // });
            }
        });
    };
};

