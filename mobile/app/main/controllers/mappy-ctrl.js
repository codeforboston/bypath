'use strict';
angular.module('main')
.controller('MappyCtrl', function ($scope, $state, $log, $filter, toos, here, Database, GeoFormatFactory, Map) {

    // Note that 'mappyCtrl' is also established in the routing in main.js.
    var mappyCtrl = this;
    
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
        mappyCtrl.data = {};
        mappyCtrl.data.complaints = toos; // all of the complaints
        mappyCtrl.data.filteredComplaints = [];
        mappyCtrl.filters = {};
        mappyCtrl.filtersSelected = [];
        mappyCtrl.showFilters = false;
        
        generateMapMarkers();
    };
    
    // On the right track but needs a little bit more clean up
    // how the map marker data is stored
    function generateMapMarkers(){
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
        var markers = [];
        angular.forEach(
            mappyCtrl.data.filteredComplaints, function(value) {
                var lat = value.markablePosition.latitude;
                var lng = value.markablePosition.longitude;
                if (lat && lng) {
                    markers[value.id.replace(/-/g,'0')] = {
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
    function onMapMoveEnd(lat, lng, zoom){
        console.log('Lat: ' + lat + ', Lng: ' + lng + ', Zoom: ' + zoom);
    }
    
    // When a map marker is clicked it the map object
    // should return the marker data to this event callback
    // We will want to display the markers info 
    function onMarkerSelected(){
        //console.log('map clicked');
    }
});
