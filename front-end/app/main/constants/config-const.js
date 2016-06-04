'use strict';

angular.module('main')

.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'BYPATH_API': 'http://localhost:8080',
    'MAPBOX_API': 'https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.{format}?access_token={apikey}',
    'GOOGLE_MAPS_API': 'https://maps.googleapis.com/maps/api'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});