'use strict';
angular.module('main')
.factory('ThreeOneOne', function ($log, $http, $q, complainables, Utils) {
  //\\
  $log.log('ThreeOneOne Factory in module main ready for action.');

  // Set up query string for grabbing multiple complaint types at once.
  function buildQueryString (complaintTypes) {

    // Base url.
    var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json'

    // Let's build a query string!
    var queryString = "";

    queryString += "&$where=case_status = 'Open'";
    queryString += " AND open_dt > '2016-02-02T00:00:00'";
    // queryString += " AND STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Park Maintenance')";
    queryString += " AND ("

    // STARTS_WITH(case_title, 'Request For Snow Plowing') OR STARTS_WITH(case_title, 'Ground Maintenance')
    for (var i = 0; i < complaintTypes.length; i++) {
      var type = complaintTypes[i];
      var caseAttr = 'case_title';
      queryString += "STARTS_WITH(" + caseAttr + ", '" + type + "')"
      // if there are more than one complaint types and given type is not last in the array, then append an OR
      if (complaintTypes.length > 1 && complaintTypes.indexOf(type) !== complaintTypes.length - 1) {
        queryString += " OR ";
      } else {
        queryString += ")";
      }
    }

    var orderer = "&$order=open_dt DESC";

    var queryable = bostonUrl + "?$limit=100" + queryString + orderer;
      //\\
      $log.log("full query url encoded:", queryable);
    return queryable;
  }

  function asyncHTTP(queryable) {
    var defer = $q.defer();

    $http({
      method: 'GET',
      url: queryable,
      headers: {
        'X-App-Token': 'zdkQROnSL8UlsDCjuiBcc3VHq' //'k7chiGNz0GPFKd4dS03IEfKuE'
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
    // [{description: 'People are annoying',
    //   location: {
    //     latitude: 42.123,
    //     longitude: 71.12312
    //   },
    //   address: "51 Market Street, Cambride, MA"
    // },{...}]
    var boston311MarkerInfos = [];

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
                address: data.data[i].location,
                open_dt: data.data[i].open_dt
            });
        }
        var boston311MarkerInfos_WithIcons = Utils.setIcons(boston311MarkerInfos);

        defer.resolve(boston311MarkerInfos_WithIcons);
      }, function error311Query(err) {
        $log.log("Shit! Error. Status: " + err.status + "\n" + err.data);
        defer.reject({error: err});
      });

    return defer.promise;
  };

  // Angular Factories, being singletons, have to return a thing.
  return {
    get311: getBoston311Data
    // , get311Fake: getFake311Data
  };
});
