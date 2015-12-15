Parse.initialize("ikx3kRNF4RME6dqQblg2t06q5ETzRsklLOOHC7QD", "6kYKiz88UsscRqK2NFO2TIGqrU3UloA3hpA8r1kv");


var Condition = Parse.Object.extend("Condition");
var query = new Parse.Query(Condition);
var map;
var gloc;
var marque;
var infowindow;

var markers = [];

$(document).ready(function() {
    initMap();
    var markers = getConditionData();
});

var getConditionData = function() {
    query.greaterThan("nummy", 0);
    query.find({
        success: function(condition) {

    		alert("Successfully retrieved " + condition.length + " descriptions.");

            for (var i = 0; i < condition.length; i++) {

                markers.push({
                    description: condition[i].get("description"),
                    location: condition[i].get("location"),
                    image: condition[i].get("image").url()
                });

                // console.log("Description : " + geoPoints[i].description);
                // console.log("Location Latitude : " + geoPoints[i].location.latitude);
                // console.log("Location Longitude : " + geoPoints[i].location.longitude);
                // console.log("Image Url : " + geoPoints[i].image);
            }
        },

        //
        //
    	// 		var Gloc = new google.maps.LatLng(Lasco.latitude, Lasco.longitude);
        //
    	// 		var marque = new google.maps.Marker({
    	// 			position: Gloc,
    	// 			title: "Call me Parsey"
    	// 		});
        //
    	// 		marque.setMap(map);
        //
    	// 		var infowindow = new google.maps.InfoWindow({
    	// 				content: "<IMG BORDER='0' ALIGN='Center' SRC='"+ImagioURL+"'>" + "My name is Johannes."
    	// 		});
        //
    	// 		marque.addListener('click', function() {
    	// 				infowindow.open(map, marque);
    	// 				alert("I'm a marker inside the Parse fn");
    	// 		});
        //
    	// 	}
    	// },
    	error: function(object, error) {
    		alert("could not retrieve parse object");
    	}
    }).done(function() {

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        // Loop through our array of markers & place each one on the map
        for( i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            //bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0]
            });

            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            //map.fitBounds(bounds);
        }

    	// marque.setMap(map);
    });
};

var initMap = function() {

    //var bounds = new google.maps.LatLngBounds();

	map = new google.maps.Map(document.getElementById('map'), {
	   center: {lat: 65.9667, lng: -18.5333},
	   zoom: 14,
	   mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	// var StataGehry = new google.maps.LatLng(42.3618181, -71.090346);
	// var Harvard = new google.maps.LatLng(42.3770029, -71.1166601);
    //
	// var marker = new google.maps.Marker({
	// 	position: StataGehry,
	// 	title: "World's best marker!"
	// });
	// var marker2 = new google.maps.Marker({
	// 	position: Harvard,
	// 	title: "Je suis un geo!"
	// });
	// marker.setMap(map);
	// marker2.setMap(map);
    //
	// var contentString = "I'm silly";
    //
	// var infowindow = new google.maps.InfoWindow({
	// 	content: "I'm goofy"
	// });
    //
	// marker.addListener('click', function() {
	// 	infowindow.open(map, marker);
	// 	alert("click on a marker to open infowindow");
	// });
    //
    //
	// var infowindow27 = new google.maps.InfoWindow({
	// 	content: "I'm number 27"
	// });
    //
	// marker2.addListener('click', function() {
	// 	infowindow27.open(map, marker2);
	// 	alert("click on a marker to open infowindow");
	// });

    // google.maps.event.addDomListener(window, 'load', initMap);
};
