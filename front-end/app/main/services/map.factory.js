'use strict';

angular.module('main')

.factory('Map', function(Geolocation, leafletData) {

    var watchId;

    function startWatchingUserPosition() {
        return Geolocation.watchUserPosition({
            frequency : 1000,
            timeout : 3000,
            enableHighAccuracy: true
        });
    };

    function initMap(positionSuccess, positionError, mapData, mapEvents) {
        this.watchId = startWatchingUserPosition();
        this.watchId
        .then(null, positionError, positionSuccess)
        .then(initMapSettings(mapData, mapEvents));
    };

    function initMapSettings(mapData, mapEvents) {
        leafletData.getMap("map")
        .then(function(map) {
            mapData();
            mapEvents(map);
//        setInterval()
        L.circle([42.33, -71.12], 3000).addTo(map);
        });

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

    function getCenterObject(latitude, longitude, zoom) {
        return  {
            lat: latitude,
            lng: longitude,
            zoom: zoom
        };
    };

   function drawLocation() {
        L.circle([42,-71], 7000).addTo(map);
   }

    return {
        watchId : watchId,
        initMap : initMap,
        getCenterObject: getCenterObject,
        getCurrentViewport: getCurrentViewport,
        drawLocation: drawLocation
    };
});