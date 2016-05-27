'use strict';

angular.module('main')

.filter('threeOneOneById', function () {
  return function (input) {
    return 'threeOneOneById filter: ' + input;
  };
})
