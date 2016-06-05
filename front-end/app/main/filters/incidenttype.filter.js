'use strict';

angular.module('main')

.filter('incidentType', function() {
    return function (incidents, filters) {
        var filteredItems = {
            filters: filters,
            items: []
        };
        angular.forEach(incidents, function (value, key) {
            filters.forEach(function(filter) {
                if (value.type == filter) {
                  filteredItems.items.push(value);
                }
            });
        }, filteredItems);

        return filteredItems.items;
    };
});
