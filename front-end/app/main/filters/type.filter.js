'use strict';

angular.module('main')

.filter('byType', function ($log) {
  return function (cases, types) {
    $log.log('types', types);
    var items = {
          types: types,
          out: []
      };
      angular.forEach(cases, function (value, key) {
        // $log.log('value.type', value.type);
        // $log.log('types.indexOf(value.type)', types.indexOf(value.type));
          if (types.indexOf(value.type) > -1) {
            this.out.push(value);
          }
      }, items);

      return items.out;
  }
})
