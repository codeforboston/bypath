'use strict';

angular.module('main')

.controller('MapCtrl', function($rootScope, $scope, $state, $log, $filter, Config, Database, Map, TileSets) {

    var mapCtrl = this;
    mapCtrl.incidents = {};
    mapCtrl.incidentsGeotagged = [];
    mapCtrl.filters = {};
    mapCtrl.popup =
        '<div class="item item-text-wrap item-icon-right">\
        <h3>{{ incidentSelected.title }}Map</h3>\
        <p>{{ incidentSelected.address }}</p>\
        <span class="type type-balanced type-small">Opened: </span>\
        <span class="type type-muted type-small">{{ incidentSelected.opened | date:"MMM dd" }}</span>\
        </div>';

    mapCtrl.queryBackend = true;
    // Default scope values.
    $scope.incidentSelected = {};
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

    // Initialize map data.
    function initMapData() {
        getMapMarkers($scope.center.lat, $scope.center.lng, 0.35);
    };

    // Set events on the map.
    function initMapEvents(map) {
        $scope.$on('leafletDirectiveMap.map.moveend', function() {
            var viewport = Map.getCurrentViewport(map);
            getMapMarkers(viewport.latitude, viewport.longitude, viewport.distance);
        });
        $scope.$on('leafletDirectiveMarker.map.click', function(e, args) {
            $scope.incidentSelected = args.model.model;
        }); 
    };

    function positionSuccess(position) {
        $log.debug("Updated user position.");
        $scope.center = Map.getCenterObject(position.coords.latitude, position.coords.longitude, 12);
    };

    function positionError(error) {
        $log.debug("Failed to update user position.");
    };

    function generateMapMarkers() {
        var markers = [];
        angular.forEach(mapCtrl.incidents, function(value, key) {
            mapCtrl.filters[value.type] = value.type;
            var extendedObj = angular.extend(value, {
                'markablePosition': {
                    latitude: value.latitude,
                    longitude: value.longitude
                }
            });
            if (value.latitude && value.longitude) {
                markers[value.id] = {
                    group:              'all',
                    model:              value,
                    lat:                value.latitude,
                    lng:                value.longitude,
                    message:            mapCtrl.popup,
                    getMessageScope:    function() { return $scope; },
                    focus:              false,
                    draggable:          false
                };
            }
        });

        $scope.markers = markers;
    };

    function getMapMarkers(lat, lng, dist){
        if (mapCtrl.queryBackend){
            Database.getIssues(lat, lng, dist, function(incidents) {
                mapCtrl.incidents = incidents;
                generateMapMarkers();
            });
            mapCtrl.queryBackend = false;
            setTimeout(queryReady, 3000);
        }
    };

    function queryReady() {
        mapCtrl.queryBackend = true;
    }

    Map.initMap(positionSuccess, positionError, initMapData, initMapEvents);
});
