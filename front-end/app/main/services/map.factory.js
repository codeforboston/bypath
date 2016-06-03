'use strict';

angular.module('main')

.factory('Map', function($q, $scope, Config, Geolocation, leafletData) {

    var map;
    var mapMarkers = {};
    var mapCenter = {};
    var tiles = {
        name: "Streets Basic",
        url: Config.ENV.MAPBOX_API,
        type: "xyz",
        options: {
            mapid: "mapbox.streets-basic",
            format: "png",
            apikey: "pk.eyJ1IjoiYWVsYXdzb24iLCJhIjoiY2luMnBtdGMxMGJta3Y5a2tqd29sZWlzayJ9.wxiPp_RFGYXGB2SzXZvfaA"
        }
    };

    function Viewport(){
        Viewport.prototype.latitude;
        Viewport.prototype.longitude;
        Viewport.prototype.distance;
    }

    function initializeMapPosition = Geolocation.getUserPosition(
        function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            mapCenter = {
                lat: latitude,
                lng: longitude,
                zoom: 12
            };
        },
        function(error) {
            var latitude = 42.39137720000001;
            var longitude = -71.1473425;
            mapCenter = {
                lat: latitude,
                lng: longitude,
                zoom: 12
            };
        }
    };

    // Get the map object
    function initialize(onMapLoaded){
        leafletData.getMap("map").then(
            function(map) {
                map = map;
                onMapLoaded();
            }
        );
    };

    function addMarkers(markers) {
        $scope.mapMarkers = markers;
    };

    function onMapMoveEnd(event){
        map.on('moveend', function(args){


            event();
        });
    };

    function onMarkerSelected(event){
        map.on('mousedown', function(args){
            //console.log(args);
            //var markerModel = args.leafletEvent.target.options.model;
            //mappyCtrl.selectedComplaint = markerModel;

            event();
        });
    };

    function getCurrentViewport(){
        var v = new Viewport();

        var coords = map.getCenter();

        var ne = map.getBounds().getNorthEast();
        var sw = map.getBounds().getSouthWest();

        var dist = Math.max(Math.abs(ne.lat - sw.lat), Math.abs(ne.lng - sw.lng));

        v.latitude = coords.lat;
        v.longitude = coords.lng;
        v.distance = dist;

        return v;
    }

    return {
        initialize: initialize,
        addMarkers: addMarkers,
        onMapMoveEnd: onMapMoveEnd,
        onMarkerSelected: onMarkerSelected,
        getCurrentViewport: getCurrentViewport
    };

});
