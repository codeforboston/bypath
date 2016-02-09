console.log('I am loading from static/conditions/js/app.js');

Parse.initialize("ikx3kRNF4RME6dqQblg2t06q5ETzRsklLOOHC7QD", "6kYKiz88UsscRqK2NFO2TIGqrU3UloA3hpA8r1kv");
var Condition = Parse.Object.extend("Condition");
var query = new Parse.Query(Condition);
var map;
var gloc;
var marque;
var markerInfos = [];
var boston311MarkerInfos = [];
var infowindow = null;

// Document ready. 
$(document).ready(function() {
    initMap();
    getConditionData();
    getBoston311Data();
    setWeather();
});

// Initialize map. 
var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 42.362598,
            lng: -71.088306
        },
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    var marcers = [];
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        //
        // // Clear out the old markers.
        marcers.forEach(function(marcer) {
            marcer.setMap(null);
        });
        marcers = [];
        //
        // // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            marcers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};

// Get live 311 data.
var getBoston311Data = function() {
    var bostonUrl = 'https://data.cityofboston.gov/resource/wc8w-nujj.json';
    // Retrieve relevant data from Boston 311 API
    $.ajax({
        url: bostonUrl,
        method: 'GET',
        headers: {
            'X-App-Token': 'k7chiGNz0GPFKd4dS03IEfKuE'
        },
        data: {
            '$query': "SELECT * WHERE open_dt > '2016-01-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(type, 'Request for Snow Plowing')" // Rodent Activity // Request for Snow Plowing // Bed Bugs // Abandoned Building // Overcrowding
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
                icon: "/static/img/boston311.png"
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
var getConditionData = function() {
    // pull entries from Parse createdAt after Aug 20 2014 :-)
    query.greaterThan("createdAt", "2014-08-20T02:06:57.931Z");
    query.find({
        success: function(condition) {
            //    alert("Successfully retrieved " + condition.length + " descriptions.");
            for (var i = 0; i < condition.length; i++) {
                markerInfos.push({
                    description: condition[i].get("description"),
                    location: condition[i].get("location"),
                    image: condition[i].get("image").url()
                });
            }
        },
        error: function(object, error) {
            alert("could not retrieve parse object");
        }
    }).done(function() {
        infowindow = new google.maps.InfoWindow({
            content: "holding..."
        });
        for (index in markerInfos) {
            console.log("Description : " + markerInfos[index].description);
            console.log("Location Latitude : " + markerInfos[index].location.latitude);
            console.log("Location Longitude : " + markerInfos[index].location.longitude);
            console.log("Image Url : " + markerInfos[index].image);
            //bounds.extend(position);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(markerInfos[index].location.latitude), parseFloat(markerInfos[index].location.longitude)),
                map: map,
                title: "Title " + index,
                icon: "/static/img/snowflake-icon.png" // THIS IS WHERE WE REPLACE THE MAP MARKER(?)
                // icon: "{% static 'img/snowranger-small.png' %}" // THIS IS WHERE WE REPLACE THE MAP MARKER(?)
                //"{% static "img/snowrangermarker.png" %}"
            });
            // where I have added .html to the marker object.
            infowindow = new google.maps.InfoWindow({
                content: "<div ><img  src=\'" + markerInfos[index].image + "\' style='max-width: 200px; max-height: 200px;'/><br><p>" + markerInfos[index].description + "</p></div>",
                maxWidth: 200,
                maxHeight: 200
            });
            google.maps.event.addListener(marker, 'click', (function(marker, infowindow) {
                return function() {
                    infowindow.open(map, this);
                };
            })(marker, infowindow));
        }
    });
};
// Docs at http://simpleweatherjs.com
var setWeather = function() {
    html = "";
    $.simpleWeather({
        location: 'Boston, MA',
        woeid: '',
        unit: 'f',
        success: function(weather) {
            html += '<h2>' + weather.city + ', ' + weather.region + " - " + weather.temp + '&deg;' + weather.units.temp + '<i class="icon-' + weather.code + '"></i></h2>';
            $("#weather").html(html);
        },
        error: function(error) {
            $("#weather").html('<p>' + error + '</p>');
        }
    });
};
setWeather();