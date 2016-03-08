'use strict';
angular.module('main')
.factory('ThreeOneOne', function ($log, $http, $q, complainables, Utils, Geo) {
  //\\
  $log.log('ThreeOneOne Factory in module main ready for action.');

  var uniqueThreeOneOneGripes = function () {
    var defer = $q.defer();

    var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json';
    var stringer = '?$limit=10000&$select=case_title,COUNT(case_title)&$group=case_title';
    var queryable = bostonUrl + stringer;

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

  // Set up query string for grabbing multiple complaint types at once.
  // -------------------------------------------------------------------------------
  // should accept:
  //              : limit <100>
  //              : status <'Open'|'Closed'|'Either'|undefined>
  //              : open_dt <'2016-03-01'>
  //              : complaintTypes <['Request for Snow Plowing', 'Damn Rats']>

  var buildQueryString = function (limit, status, opened_date, complaintTypes) {

    // Set defaults if no val passed.
    limit = typeof limit !== 'undefined' ? limit : 100;
    status = typeof status !== 'undefined' ? status : 'Either'; // default to include either open or closed
    opened_date = typeof opened_date !== 'undefined' ? opened_date : '2016-03-01';
    complaintTypes = typeof complaintTypes !== 'undefined' ? complaintTypes : complainables.GRIPES;

    // Base url.
    var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json';

    // Let's build a query string!
    var queryString = "";
    queryString += "&$where=";

    // Status picker.
    if (status === 'Open'){
      queryString += "case_status = 'Open'  AND ";
    }
    else if (status === 'Closed') {
      queryString += "case_status = 'Closed'  AND ";
    }
    else {
      // queryString += "case_status = 'Open'";
    }

    queryString += "open_dt > '" + opened_date + "T00:00:00'";
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

    var queryable = bostonUrl + "?$limit=" + limit + queryString + orderer;
      //\\
      $log.log("full query url encoded:", queryable);
    return queryable;
  };

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

  var addToGeofire = function (key, locArray) {
    Geo.set(key, locArray).then(function () {
      $log.log('added to geofire case id: ' + key + ' at ' + locArray);
    });
  };

  var parseDataMarkers = function (data) {
    var dataMarkers = [];
    for (var i = 0; i < data.data.length; i++) {

      // Add to Geofire.
      addToGeofire(data.data[i].case_enquiry_id, [
        parseFloat(data.data[i].latitude),
        parseFloat(data.data[i].longitude)
      ]);

      // Push to map marker array.
      dataMarkers.push({
          id: data.data[i].case_enquiry_id,

          description: data.data[i].case_title,
          location: {
            latitude: data.data[i].latitude,
            longitude: data.data[i].longitude
          },
          address: data.data[i].location,
          case_status: data.data[i].case_status,
          open_dt: data.data[i].open_dt,
          closed_dt: data.data[i].closed_dt
      });
    }

    // Finally, set constructed array to also hold path urls for associated images.
    return Utils.setIcons(dataMarkers);
  };

  var getBoston311Data = function(query) {

    var defer = $q.defer();

    asyncHTTP(query)
      .then(function successful311Query (data) {

        defer.resolve(parseDataMarkers(data));
      }, function error311Query(err) {

        $log.log("Shit! Error. Status: " + err.status + "\n" + err.data);
        defer.reject({error: err});
      });

    return defer.promise;
  };

  // Angular Factories, being singletons, have to return a thing.
  return {
    get311: getBoston311Data,
    buildQuery: buildQueryString,
    uniqueCases: uniqueThreeOneOneGripes
    // , get311Fake: getFake311Data
  };
});
