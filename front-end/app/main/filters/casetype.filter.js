'use strict';

angular.module('main')

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
        if (typeof value['type'] === 'undefined') { return; }
        if (this.types[value['type']]) {
          this.out.push(value);
        }
      }, items);

      return items.out;
    };
})
