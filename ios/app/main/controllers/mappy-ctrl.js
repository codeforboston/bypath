'use strict';
angular.module('main')
.controller('MappyCtrl', function ($scope, $state, $log, $filter, toos, here, Database, GeoFormatFactory) {

  // Note that 'mappyCtrl' is also established in the routing in main.js.
  var mappyCtrl = this;

  // testes
  mappyCtrl.name = 'asdf';

  // Holsters.
  mappyCtrl.data = {};
  mappyCtrl.data.complaints = toos; // all of the complaints
  mappyCtrl.data.filteredComplaints = [];
  mappyCtrl.filters = {};
  mappyCtrl.filtersSelected = []; // NOTE: is now filled as an init() from first 3 elements in _.keys(mappyCtrl.filters)
  // This way some markers are loaded onto the map by default, instead of blank.

  /**
   * Assign a markable position to each filterable complaint.
   * @param  {Array} value                     Complaint object.
   * @param  {Property} key
   * @return  {Array} mappyCtrl.data.complaints Fill with appended markably appended compalaints.
   */
  angular.forEach(mappyCtrl.data.complaints, function (value, key) {

    // Generate general list of filters.
    mappyCtrl.filters[value.type] = value.type;

    // Generate markable position.
    var markablePosition = GeoFormatFactory.parseLocationStringToNamedObject(value.geo);

    // Extend original complaint to include markable position.
    var extendedObj = angular.extend(value, {'markablePosition': markablePosition});

    // 'this' is mappyCtrl.data.filteredComplaints
    this.push(extendedObj);
  }, mappyCtrl.data.filteredComplaints);


  // Watch filters; if they change, filter original complain list against filters to return
  // corresponding mappyCtrl.data.filteredComplaints
  // http://stackoverflow.com/questions/19455501/angularjs-watch-an-object
  $scope.$watch(angular.bind(mappyCtrl, function () {
    return mappyCtrl.filtersSelected;
  }), function (newVal) {
    // $log.log('Case types changed from to ',newVal);
    var filtered;
    filtered = $filter('incidentType')(mappyCtrl.data.complaints, mappyCtrl.filtersSelected);
    // filtered = $filter('filter')(filtered, mappyCtrl.filtersSelected.search);
    mappyCtrl.data.filteredComplaints = filtered;
  }, true);

  // mappyCtrl.toggleCaseTypeInFilter = function (caseType) {
  //   var typeFilter = mappyCtrl.filters.caseTypes[caseType];
  //   if (typeFilter !== null) {
  //     mappyCtrl.filters.caseTypes[caseType] = !typeFilter;
  //   } else { // else implement
  //     mappyCtrl.filters.caseTypes[caseType] = true;
  //   }
  // };

  // Defaults.
  // ui
  mappyCtrl.showFilters = false;
  // map
  mappyCtrl.zoom = 12;
  mappyCtrl.boston = {
    coords: {
      latitude: 42.4,
      longitude: -71.1
    }
  };

  /**
   * Click on a marker to show complaint detail card in map view.
   * @param  {google marker} marker
   * @param  {click} eventName
   * @param  {mappyCtrl.data.complaints.<object>} model     One of the extended complaints.
   * @return {Object}           Creates or updates object on mappyCtrl.
   */
  function onMarkerClick (marker, eventName, model) {
    //\\
    $log.log('Click marker');
    $log.log('model.id: ' + model.id);
    mappyCtrl.data.selectedComplaint = model;
  }

  var initializeMap = function (position) {

    // Create the Google Map
    mappyCtrl.map = {
      center: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      zoom: mappyCtrl.zoom,
      // control: {},
      // styles: mappyStyle,
      // markers: get311Markers(),
      options: {scrollwheel: false},
      disableDefaultUI: false,
      markerEvents: {
        click: onMarkerClick
      }
    };
  };

  // Init filtersSelected (so that *something*) shows up on the map when you load.
  // Currently defaults to show first 3 elements from mappyCtrl.filters.
  function initFiltersSelected() {
    var distinctTypes = _.keys(mappyCtrl.filters);
    for (var i = 0; i < 3; i++) {
      mappyCtrl.filtersSelected.push(distinctTypes[i]);
    }
  }
  initFiltersSelected();

  // If user's geolocation is available, center the map there, else default to Boston.
  if (typeof here !== 'undefined') {
    initializeMap(here.location);
  } else {
    initializeMap(mappyCtrl.boston);
  }

});
