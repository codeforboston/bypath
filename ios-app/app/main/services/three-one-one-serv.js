'use strict';
angular.module('main')
.factory('ThreeOneOne', function ($log, $http, $q) {
  //\\
  $log.log('ThreeOneOne Factory in module main ready for action.');

  // Set up query string for grabbing multiple complaint types at once.
  function buildQueryString (complaintTypes) {
    var queryString = "";
    queryString += "SELECT * WHERE open_dt > '2016-01-01T00:00:00'" +
                  " AND case_status = 'Open'" +
                  " AND ("

    // STARTS_WITH(case_title, 'Request For Snow Plowing') OR STARTS_WITH(case_title, 'Ground Maintenance')
    for (var i = 0; i < complaintTypes.length; i++) {
      var type = complaintTypes[i];
      var caseAttr = "description"; // 'case_title'
      queryString += "STARTS_WITH(" + caseAttr + ", '" + type + "')"
      // if there are more than one complaint types and given type is not last in the array, then append an OR
      if (complaintTypes.length > 1 && complaintTypes.indexOf(type) !== complaintTypes.length - 1) {
        $log.log(complaintTypes.indexOf(type));
        $log.log(complaintTypes.length - 1);
        queryString += " OR "
      }
    }

    // var testString = "SELECT * WHERE open_dt > '2016-03-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(case_title, 'Metrolist Survery')";
    $log.log("queryString:", queryString);
    return queryString;
    // return testString;
    // "SELECT * WHERE open_dt > '2016-01-01T00:00:00' AND case_status = 'Open' AND (STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance') OR STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions'))"
  }

  function asyncHTTP(query) {
    var defer = $q.defer();
    var bostonUrl = 'https://data.cityofboston.gov/resource/wc8w-nujj.json';
    $http({
      method: 'GET',
      url: bostonUrl,
      headers: {
        'X-App-Token': 'k7chiGNz0GPFKd4dS03IEfKuE'
      },
      data: {
        '$query': query // "SELECT * WHERE open_dt > '2016-03-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(case_title, 'Metrolist Survery')" //query
      }
    }).success(function (data, status, headers, config) {
        defer.resolve({data: data});
      })
      .error(function (data, status, headers, config) {
        defer.reject({status: status, data: data});
      });
    return defer.promise;
  };

  var getBoston311Data = function(complaintTypes) {

    var defer = $q.defer();
    var query = buildQueryString(complaintTypes);

    // This will hold an array object information for each complaint type.
    // We're going to return this so the controller can populate markers on the map.
    var boston311MarkerInfos = [];
      // [{description: 'People are annoying',
      //   location: {
      //     latitude: 42.123,
      //     longitude: 71.12312
      //   },
      //   address: "51 Market Street, Cambride, MA"
      // },{...}]

    asyncHTTP(query)
      .then(function successful311Query(data) {
        for (var i = 0; i < data.data.length; i++) {
            var loc = {
                latitude: data.data[i].latitude,
                longitude: data.data[i].longitude
            };
            boston311MarkerInfos.push({
                id: "311" + i.toString(),
                description: data.data[i].case_title,
                location: loc,
                address: data.data[i].location
            });
        }
        defer.resolve(boston311MarkerInfos);
      }, function error311Query(err) {
        $log.log("Shit! Error. Status: " + err.status + "\n" + err.data);
        defer.reject({error: err});
      });

    return defer.promise;
  };

  // Angular Factories, being singletons, have to return a thing.
  return {
    get311: getBoston311Data
  };
});
