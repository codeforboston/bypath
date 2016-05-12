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
    // MapBox tiles dictionary.
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

    // Leaflet variables on scope.
    $scope.mapMarkers = {};
    $scope.tiles = mappyCtrl.tiles['mapbox_streets_basic'];
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

    // Generate filters.
    angular.forEach(mappyCtrl.data.complaints, function (value, key) {
            // Generate general list of filters.
            mappyCtrl.filters[value.type] = value.type;
            // Generate markable position.
            var markablePosition = GeoFormatFactory.parseLocationStringToNamedObject(value.geo);
            var extendedObj = angular.extend(value, {'markablePosition': markablePosition});
            this.push(extendedObj);
        },
        mappyCtrl.data.filteredComplaints
    );

    // Filter incidents.
    var filtered = $filter('incidentType')(mappyCtrl.data.complaints, Object.keys(mappyCtrl.filters));
    filtered = $filter('filter')(filtered, mappyCtrl.filters.search);
    mappyCtrl.data.filteredComplaints = filtered;
    // Create markers dictionary for Leaflet directive.
    angular.forEach(
        mappyCtrl.data.filteredComplaints, function(value) {
            var lat = value.markablePosition.latitude;
            var lng = value.markablePosition.longitude;
            if (lat && lng) {
                this[value.id.replace(/-/g,'0')] = {
                    group:     'all',
                    model:     value,
                    lat:       value.markablePosition.latitude,
                    lng:       value.markablePosition.longitude,
                    focus:     false,
                    draggable: false
                };
            }
        },
        $scope.mapMarkers
    );
});
