'use strict';

angular.module('main')

.controller('MapCtrl', function($scope, $state, $log, $filter, Database, Geolocation) {

    var mapCtrl = this;
    mapCtrl.data = {};
    mapCtrl.data.filteredComplaints = [];
    mapCtrl.filters = {};
    mapCtrl.filtersSelected = [];
    mapCtrl.showFilters = false;

    $scope.markers = [];
    $scope.tiles = {};

    // Get location, then initialize map.
    Geolocation.getUserPosition()
    .then(
        function(position) {
            $log.debug("Got user position.");
            $scope.mapCenter = getCenterObject(position.coords.latitude, position.coords.longitude, 12);
        },
        function(error) {
            $log.debug("Failed to obtain user position.");
            $scope.mapCenter = getCenterObject(42.39137720000001, -71.1473425, 12);
        }
    )
    .then(initMap);

    // Initialize map.
    function initMap() {
        leafletData.getMap("map")
        .then(function(map) {
            initMapData('Streets Basic')
            initMapEvents(map);
        });
    };

    // Initialize map data.
    function initMapData(tileset) {
        mapCtrl.tiles = TileSets.getTileSet(tileset);
        Database.getIssues($scope.mapCenter.lat, $scope.mapCenter.lng, 0.35, function(data) {
            mapCtrl.data.complaints = data;
            generateMapMarkers();
        });
    };

    // Set events on the map.
    function initMapEvents(map) {
        map.on('moveend', function() {
            var viewport = getCurrentViewport();
            Database.getIssues(viewport.latitude, viewport.longitude, viewport.distance, function(data) {
                mapCtrl.data.complaints = data;
                generateMapMarkers();
            });
        });
        map.on('mousedown', function() {
            // Do something.
        });
    };

    function getCenterObject(latitude, longitude, zoom) {
        return  {
            lat: latitude,
            lng: longitude,
            zoom: zoom
        };
    };

    // On the right track but needs a little bit more clean up
    // how the map marker data is stored
    function generateMapMarkers() {
        // Generate filters.
        angular.forEach(mapCtrl.data.complaints, function (value, key) {
                // Generate general list of filters.
                mapCtrl.filters[value.type] = value.type;
                // Generate markable position.
                var markablePosition = {latitude: value.latitude, longitude: value.longitude};
                var extendedObj = angular.extend(value, {'markablePosition': markablePosition});
                this.push(extendedObj);
            },
            mapCtrl.data.filteredComplaints
        );

        // Filter incidents.
        var filtered = $filter('incidentType')(mapCtrl.data.complaints, Object.keys(mapCtrl.filters));
        filtered = $filter('filter')(filtered, mapCtrl.filters.search);
        mapCtrl.data.filteredComplaints = filtered;

        // Create markers dictionary for Leaflet directive.
        var markers = [];
        angular.forEach(
            mapCtrl.data.filteredComplaints, function(value) {
                var lat = value.markablePosition.latitude;
                var lng = value.markablePosition.longitude;
                if (lat && lng) {
                    markers[value.id] = {
                        group:     'all',
                        model:     value,
                        lat:       value.markablePosition.latitude,
                        lng:       value.markablePosition.longitude,
                        focus:     false,
                        draggable: false
                    };
                }
            }
        );

        $scope.markers = markers;
    };

    function Viewport() {
        Viewport.prototype.latitude;
        Viewport.prototype.longitude;
        Viewport.prototype.distance;
    };

    function getCurrentViewport() {
        var v = new Viewport();
        var coords = map.getCenter();
        var ne = map.getBounds().getNorthEast();
        var sw = map.getBounds().getSouthWest();
        var dist = Math.max(Math.abs(ne.lat - sw.lat), Math.abs(ne.lng - sw.lng));

        v.latitude = coords.lat;
        v.longitude = coords.lng;
        v.distance = dist;

        return v;
    };
});
