'use strict';

angular.module('main')
.controller('MapCtrl', function ($scope, $state, $log, $filter, Database, Map) {

    // Note that 'mapCtrl' is also established in the routing in main.js.
    var mapCtrl = this;

    $scope.getUserPosition = function() {
        Geolocation.getUserPosition(getPositionSuccess, getPositionFailure)
    };

    // Initialize the map object. When that is done
    // we can set up our event hooks and generate the
    // map markers
    Map.initialize(function(){
        Map.onMarkerSelected(onMarkerSelected);
        Map.onMapMoveEnd(onMapMoveEnd);
        run();
    });

    function run(){
        // Variables.
        mapCtrl.data = {};
        mapCtrl.data.filteredComplaints = [];
        mapCtrl.filters = {};
        mapCtrl.filtersSelected = [];
        mapCtrl.showFilters = false;
        console.log($scope.mapCenter);
        Database.getIssues($scope.mapCenter.lat, $scope.mapCenter.lng, 0.35, function(data){
            mapCtrl.data.complaints = data;
            generateMapMarkers();
        });
    };

    // On the right track but needs a little bit more clean up
    // how the map marker data is stored
    function generateMapMarkers(){
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
            });

        Map.addMarkers(markers);
    }

    // This gets called when ever the map is either moved
    // or zoomed.
    // When the map is moved pased the cached map markers
    // we will need to do a new query and generate a new
    // set of map markers.
    function onMapMoveEnd(){
        var viewport = Map.getCurrentViewport();

        Database.getIssues(viewport.latitude, viewport.longitude, viewport.distance, function(data){
            mapCtrl.data.complaints = data;

            generateMapMarkers();
        });
    }

    // When a map marker is clicked it the map object
    // should return the marker data to this event callback
    // We will want to display the markers info
    function onMarkerSelected(){
        //console.log('map clicked');
    }
});

function getPositionSuccess(position) {
    $log.log("Success. Using obtained position.");
    $rootScope.userPosition = position;
}

function getPositionFailure() {
    $log.log("Failed. Using default position.");
    var defaultPosition = {
        coords: {
            accuracy: 70,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 42.39137720000001,
            longitude: -71.1473425,
            speed: null
        },
        timestamp: 1463167968457
    };
    $rootScope.userPosition = defaultPosition;
}
