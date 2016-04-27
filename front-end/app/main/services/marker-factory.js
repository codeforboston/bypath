'use strict';

angular.module('main')
.factory('MarkerFactory', function MarkerFactory ($log, $http, $q, complainables, ThreeOneOne, Utils, Geo) {

  $log.log('MarkerFactory checking in.');


  /*----------  Parse 311 data into map markers static array ----------*/

  // MarkerFactory.currentMarkers = [];
  // Expects {data: {data: [{object}, {object}...]}}
  var parseDataToMarkers = function (data) {

    var markers = [];

    for (var i = 0; i < data.data.length; i++) {

      // Add to Geofire.
      ThreeOneOne.addToGeofire(
        // --> key
        data.data[i].case_enquiry_id,
          // --> location
          [
            parseFloat(data.data[i].latitude),
            parseFloat(data.data[i].longitude)
          ]
      );

      // Push to map marker array.
      markers.push({
          id: data.data[i].case_enquiry_id,

          description: data.data[i].case_title,
          location: {
            latitude: data.data[i].latitude,
            longitude: data.data[i].longitude
          },
          address: data.data[i].location,
          case_status: data.data[i].case_status,
          open_dt: data.data[i].open_dt,
          closed_dt: data.data[i].closed_dt
      });
    }

    // Finally, set constructed array to also hold path urls for associated images and return.
    // MarkerFactory.currentMarkers = Utils.setIcons(markers);
    // return MarkerFactory.currentMarkers;
    return Utils.setIcons(markers);
  };


  return {
    // currentMarkers: MarkerFactory.currentMarkers,
    parseDataToMarkers: parseDataToMarkers
  };

});
