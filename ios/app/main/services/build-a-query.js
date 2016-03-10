'use strict';

angular.module('main')
.factory('BuildAQuery', function ($log, $http, $q, complainables, Utils, Geo) {

  $log.log('BuildAQuery checking in.');

  /*----------  Build query for boston 311 socrata SODA API  ----------*/
  // Boston's 311 data is massed in aggregate; so there's one big ass 311 table with all
  // the complaints in it. Chicago, however, has 12 different tables each containing
  // a popular complaint type. So the queries would be a little different (different base
  // urls too, obviously).

  var boston311Query = function (limit, status, opened_date, complaintTypes) {

    // Set defaults if no val passed.
    limit = typeof limit !== 'undefined' ? limit : 100;
    status = typeof status !== 'undefined' ? status : 'Either'; // default to include either open or closed
    opened_date = typeof opened_date !== 'undefined' ? opened_date : '2016-03-01';
    complaintTypes = typeof complaintTypes !== 'undefined' ? complaintTypes : complainables.GRIPES;

    // Base url.
    var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json';

    // Let's build a query string!
    // NOTE: queries to socrata are written in SoQL. Whatever the fuck that is.
    var queryString = "";

    // $where.
    queryString += "&$where=";

    // Status picker; open, closed, or either (default).
    if (status === 'Open'){
      queryString += "case_status = 'Open'  AND ";
    }
    else if (status === 'Closed') {
      queryString += "case_status = 'Closed'  AND ";
    }
    else {
      // queryString += "case_status = 'Open'";
    }

    // Make sure case opened date is after specified query.
    queryString += "open_dt > '" + opened_date + "T00:00:00'";

    queryString += " AND ("

    // Set 'OR' relationship to include all specified complaints types in [].
    for (var i = 0; i < complaintTypes.length; i++) {
      var type = complaintTypes[i];
      var caseAttr = 'type';
      queryString += "STARTS_WITH(" + caseAttr + ", '" + type + "')"
      // if there are more than one complaint types and given type is not last in the array, then append an OR
      if (complaintTypes.length > 1 && complaintTypes.indexOf(type) !== complaintTypes.length - 1) {
        queryString += " OR ";
      } else {
        queryString += ")";
      }
    }

    // Order by most recent on top.
    var orderer = "&$order=open_dt DESC";

    // Concatenate the query string.
    var queryable = bostonUrl + "?$limit=" + limit + queryString + orderer;
      //\\
      $log.log("full query url:", queryable);
    return queryable;
  };

  return {
    boston311Query: boston311Query
  };

})
