'use strict';
angular.module('main')
.filter('threeOneOneById', function () {
  return function (input) {
    return 'threeOneOneById filter: ' + input;
  };
})

// .filter('unique', function() {
//     return function (arr, field) {
//         return _.uniq(arr, function(a) { return a[field]; });
//     };
// })
//

.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
})

/**
 * Return only cases that match the given case types.
 * @param  {Array.<object>} complaints            The array to be filtered.
 * @param  {Object} caseTypesToMatch Desired case types to show in list or on map.  ie { "action": true, "family": false }
 * @return {Array.<object>}                  Filtered array.
 */
// http://stackoverflow.com/questions/15868248/how-to-filter-multiple-values-or-operation-in-angularjs
// http://jsfiddle.net/Xesued/Bw77D/7/
.filter('whereCaseType', function () {
    return function (complaints, caseTypesToMatch) {
      var items = {
        types: caseTypesToMatch,
        out: []
      };

      angular.forEach(complaints, function (value, key) {
        if (this.types[value.type]) {
          this.out.push(value);
        }
      }, items);

      return items.out;
    };
})

.filter('incidentType', function() {
    return function (complaints, filters) {
        var filteredItems = {
            filters: filters,
            items: []
        };
        angular.forEach(complaints, function (value, key) {
            filters.forEach(function(filter) {
                if (value.type == filter) {
                  filteredItems.items.push(value);
                }
            });
        }, filteredItems);

        return filteredItems.items;
    };
});
