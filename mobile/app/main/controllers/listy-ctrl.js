'use strict';
angular.module('main')
.controller('ListyCtrl', function ($scope, $log, $filter, toos, here, GeoFormatFactory) {

  var listyCtrl = this;

  // Holsters.
  listyCtrl.data = {};
  listyCtrl.data.complaints = toos; // all of the complaints
  listyCtrl.data.filteredComplaints = [];
  listyCtrl.data.filters = {};
  listyCtrl.data.filtersSelected = []; // NOTE: is now filled as an init() from first 3 elements in _.keys(listyCtrl.data.filters)
  // This way some markers are loaded onto the map by default, instead of blank.

  angular.forEach(listyCtrl.data.complaints, function (value, key) {
    // Generate general list of filters.
    listyCtrl.data.filters[value.type] = value.type;
  });

  // Watch filters; if they change, filter original complain list against filters to return
  // corresponding listyCtrl.data.filteredComplaints
  // http://stackoverflow.com/questions/19455501/angularjs-watch-an-object
  $scope.$watch(angular.bind(listyCtrl, function () {
    return listyCtrl.data.filtersSelected;
  }), function (newVal) {
    // $log.log('Case types changed from to ',newVal);
    var filtered;
    filtered = $filter('incidentType')(listyCtrl.data.complaints, listyCtrl.data.filtersSelected);
    // filtered = $filter('filter')(filtered, listyCtrl.data.filtersSelected.search);
    listyCtrl.data.filteredComplaints = filtered;
  }, true);

  // Init filtersSelected (so that *something*) shows up on the map when you load.
  // Currently defaults to show first 3 elements from listyCtrl.data.filters.
  function initFiltersSelected() {

    var distinctTypes = _.keys(listyCtrl.data.filters);
    $log.log('distinctTypes', distinctTypes);
    for (var i = 0; i < 3; i++) {
      listyCtrl.data.filtersSelected.push(distinctTypes[i]);
    }
  }
  initFiltersSelected();


});
