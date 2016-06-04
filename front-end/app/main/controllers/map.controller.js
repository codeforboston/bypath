'use strict';

angular.module('main')

.controller('MapCtrl', function($scope, $state, $log, $filter, Config, Database, Geolocation, TileSets, leafletData) {

    var mapCtrl = this;
    mapCtrl.incidents = {};
    mapCtrl.incidentsGeotagged = [];
    mapCtrl.filters = {};

    // Default scope values.
    $scope.markers = [];
    $scope.tiles = {
        name: "Streets Basic",
        url: Config.ENV.MAPBOX_API,
        type: "xyz",
        options: {
            mapid: "mapbox.streets-basic",
            format: "png",
            apikey: "pk.eyJ1IjoiYWVsYXdzb24iLCJhIjoiY2luMnBtdGMxMGJta3Y5a2tqd29sZWlzayJ9.wxiPp_RFGYXGB2SzXZvfaA"
        }
    };
    $scope.center = {
        lat: 42.39137720000001,
        lng: -71.1473425,
        zoom: 12
    };

    // Initialize map.
    function initMap() {
        leafletData.getMap("map")
        .then(function(map) {
            initMapData();
            initMapEvents(map);
        });
    };

    // Initialize map data.
    function initMapData(tileset) {
        Database.getIssues($scope.center.lat, $scope.center.lng, 0.35, function(incidents) {
            mapCtrl.incidents = incidents;
            generateMapMarkers();
        });
    };

    // Set events on the map.
    function initMapEvents(map) {
        map.on('moveend', function() {
            var viewport = getCurrentViewport(map);
            Database.getIssues(viewport.latitude, viewport.longitude, viewport.distance, function(incidents) {
                mapCtrl.incidents = incidents;
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

    function startWatchingUserPosition() {
        return Geolocation.watchUserPosition({
            frequency : 1000,
            timeout : 3000,
            enableHighAccuracy: true
        });
    };

    function positionSuccess(position) {
        $log.debug("Updated user position.");
        $scope.center = getCenterObject(position.coords.latitude, position.coords.longitude, 12);
    };

    function positionError(error) {
        $log.debug("Failed to update user position.");
    };

    function generateMapMarkers() {
        angular.forEach(mapCtrl.incidents, function(value, key) {
            mapCtrl.filters[value.type] = value.type;
            var extendedObj = angular.extend(value, {
                'markablePosition': {
                    latitude: value.latitude,
                    longitude: value.longitude
                }
            });
            this.push(extendedObj);
        },
        mapCtrl.incidentsGeotagged
        );

        // Create markers dictionary for Leaflet directive.
        var markers = [];
        angular.forEach(
            mapCtrl.incidentsGeotagged, function(value) {
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
        console.log(markers);
    };

    function Viewport() {
        Viewport.prototype.latitude;
        Viewport.prototype.longitude;
        Viewport.prototype.distance;
    };

    function getCurrentViewport(map) {
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

    // Start watching user position.
    startWatchingUserPosition()
    .then(null, positionError, positionSuccess)
    // Initialize the map.
    initMap();
});
