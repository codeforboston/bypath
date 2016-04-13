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

  /**
   * Assign a markable position to each filterable complaint.
   * @param  {Array} value                     Complaint object.
   * @param  {Property} key
   * @return  {Array} mappyCtrl.data.complaints Fill with appended markably appended compalaints.
   */
  angular.forEach(toos, function (value, key) {
    var markablePosition = GeoFormatFactory.parseLocationStringToNamedObject(value.geo);
    var extendedObj = angular.extend(value, {'markablePosition': markablePosition});
    this.push(extendedObj);
  }, mappyCtrl.data.filteredComplaints);

  // if (mappyCtrl.data.complaints) {
  //   $filter('whereCaseType')(mappyCtrl.data.complaints, mappyCtrl.data.filters.caseTypes);
  // }
  //

  // http://stackoverflow.com/questions/19455501/angularjs-watch-an-object
  $scope.$watch(angular.bind(mappyCtrl, function () {
    return mappyCtrl.filters;
  }), function (newVal) {
    //\\
    $log.log('Case types changed from to ',newVal);
    var filtered;
    filtered = $filter('whereCaseType')(mappyCtrl.data.complaints, mappyCtrl.filters.caseTypes);
    filtered = $filter('filter')(filtered, mappyCtrl.filters.search);
    mappyCtrl.data.filteredComplaints = filtered;
  }, true);


  mappyCtrl.toggleCaseTypeInFilter = function (caseType) {
    var typeFilter = mappyCtrl.filters.caseTypes[caseType];
    if (typeFilter !== null) {
      mappyCtrl.filters.caseTypes[caseType] = !typeFilter;
    } else { // else implement
      mappyCtrl.filters.caseTypes[caseType] = true;
    }
  };

  // Defaults.
  // ui
  mappyCtrl.showFilters = false;
  mappyCtrl
  // map
  mappyCtrl.zoom = 12;
  mappyCtrl.boston = {
    coords: {
      latitude: 42.4,
      longitude: -71.1
    }
  };
  // data filters
  mappyCtrl.filters.caseTypes = {
    'Unsafe Dangerous Conditions': true,
    'Ground Maintenance': true
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

  // If user's geolocation is available, center the map there, else default to Boston.
  if (typeof here !== 'undefined') {
    initializeMap(here.location);
  } else {
    initializeMap(mappyCtrl.boston);
  }

});
