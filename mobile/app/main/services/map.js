'use strict';
angular.module('main')
.factory('Map', function ($q, $rootScope, leafletData) {
    
    var map;
    
    // Get the map object
    function initialize(onMapLoaded){
        leafletData.getMap("map").then(
            function (m) {
                map = m;
                onMapLoaded();
            }
        );
        
        $rootScope.mapMarkers = {};
        
        $rootScope.tiles = {
            name: "Streets Basic",
            url: "https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.{format}?access_token={apikey}",
            type: "xyz",
            options: {
                mapid: "mapbox.streets-basic",
                format: "png",
                apikey: "pk.eyJ1IjoiYWVsYXdzb24iLCJhIjoiY2luMnBtdGMxMGJta3Y5a2tqd29sZWlzayJ9.wxiPp_RFGYXGB2SzXZvfaA" 
            }
        };
        
        // This should be getting the lat and lng from the users position
        $rootScope.mapCenter = {
            lat: 42.4,
            lng: -71.1,
            zoom: 12
        };
    };
    
    function addMarkers(markers) {
        $rootScope.mapMarkers = markers;
    };
    
    function onMapMoveEnd(event){
        map.on('moveend', function(args){
            var coords = map.getCenter();
            
            var ne = map.getBounds().getNorthEast();
            var sw = map.getBounds().getSouthWest();
            
            var dist = Math.max(Math.abs(ne.lat - sw.lat), Math.abs(ne.lng - sw.lng))
            
            event(coords.lat, coords.lng, dist);
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

    return {
        initialize: initialize,
        addMarkers: addMarkers,
        onMapMoveEnd: onMapMoveEnd,
        onMarkerSelected: onMarkerSelected
    };

});
