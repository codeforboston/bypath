'use strict';
angular.module('main')
.factory('Map', function ($q, $rootScope, leafletData) {
    
    function Viewport(){
        Viewport.prototype.latitude;
        Viewport.prototype.longitude;
        Viewport.prototype.distance;
    }
    
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
