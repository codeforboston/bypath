'use strict';
angular.module('main')
.controller('MappyCtrl', function ($scope, $state, $log, $filter, toos, here, Database, GeoFormatFactory) {

// Note that 'mappyCtrl' is also established in the routing in main.js.
var mappyCtrl = this;

// Variables.
mappyCtrl.data = {};
mappyCtrl.data.complaints = toos; // all of the complaints
mappyCtrl.data.filteredComplaints = [];
mappyCtrl.filters = {};
mappyCtrl.filtersSelected = [];
mappyCtrl.showFilters = false;
mappyCtrl.tiles = {
    mapbox_streets_basic:   {
        name: "Streets Basic",
        url: "https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.{format}?access_token={apikey}",
        type: "xyz",
        options: {
            mapid: "mapbox.streets-basic",
            format: "png",
            apikey: "pk.eyJ1IjoiYWVsYXdzb24iLCJhIjoiY2luMnBtdGMxMGJta3Y5a2tqd29sZWlzayJ9.wxiPp_RFGYXGB2SzXZvfaA"
        }
    }
};

$scope.tiles = mappyCtrl.tiles['mapbox_streets_basic'];

// Leaflet variables on scope.
$scope.mapMarkers = {};

$scope.mapEvents = {
    Marker : {
        enable: ['mousedown'],
        logic: 'emit'
    }
};

$scope.mapCenter = {
    lat: 42.4,
    lng: -71.1,
    zoom: 12
};

// Leaflet event handlers.
$scope.$on('leafletDirectiveMarker.mymap.mousedown', function(event, args) {
      var markerModel = args.leafletEvent.target.options.model;
      mappyCtrl.selectedComplaint = markerModel;
});

/**
 * Assign a markable position to each filterable complaint.
 * @param  {Array} value                     Complaint object.
 * @param  {Property} key
 * @return  {Array} mappyCtrl.data.complaints Fill with appended markably appended compalaints.
 */
angular.forEach(mappyCtrl.data.complaints, function (value, key) {
  // Generate general list of filters.
  mappyCtrl.filters[value.type] = value.type;
  // Generate markable position.
  var markablePosition = GeoFormatFactory.parseLocationStringToNamedObject(value.geo);
  var extendedObj = angular.extend(value, {'markablePosition': markablePosition});
  this.push(extendedObj);
}, mappyCtrl.data.filteredComplaints);

// Watch the filtersSelected variable.
$scope.$watch(angular.bind(mappyCtrl, function () {
  return mappyCtrl.filtersSelected;
}), function (newVal) {
      // Filter incidents.
      var filtered = $filter('incidentType')(mappyCtrl.data.complaints, mappyCtrl.filtersSelected);
      filtered = $filter('filter')(filtered, mappyCtrl.filtersSelected.search);
      mappyCtrl.data.filteredComplaints = filtered;
      // Create markers dictionary for Leaflet directive.
      $scope.mapMarkers = {};
      angular.forEach(mappyCtrl.data.filteredComplaints, function(value) {
          var lat = value.markablePosition.latitude;
          var lng = value.markablePosition.longitude;
          if (lat && lng) {
              this[value.id.replace(/-/g,'0')] = {
                  group: 'all',
                  model: value,
                  lat: value.markablePosition.latitude,
                  lng: value.markablePosition.longitude,
                  focus: false,
                  draggable: false
              };
          }
      }, $scope.mapMarkers);
    }, true);
});
