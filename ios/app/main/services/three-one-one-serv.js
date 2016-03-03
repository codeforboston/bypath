'use strict';
angular.module('main')
.factory('ThreeOneOne', function ($log, $http, $q, complainables) {
  //\\
  $log.log('ThreeOneOne Factory in module main ready for action.');

  // Set up query string for grabbing multiple complaint types at once.
  function buildQueryString (complaintTypes) {

    // Base url.
    // https://data.cityofboston.gov/resource/awu8-dc52.json
    // var bostonUrl = 'https://data.cityofboston.gov/resource/wc8w-nujj.json';
    var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json'

    // Let's build a query string!
    var queryString = "";
    // queryString += "SELECT * WHERE open_dt > '2016-02-02T00:00:00'" +
    //               " AND case_status = 'Open'" +
    //               " AND ("
    queryString += "&$where=case_status = 'Open'";
    queryString += " AND open_dt > '2016-02-02T00:00:00'";
    // queryString += " AND STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Park Maintenance')";
    queryString += " AND ("

    // STARTS_WITH(case_title, 'Request For Snow Plowing') OR STARTS_WITH(case_title, 'Ground Maintenance')
    for (var i = 0; i < complaintTypes.length; i++) {
      var type = complaintTypes[i];
      var caseAttr = 'case_title'; // 'description'; //'case_title';//"description"; // 'case_title'
      queryString += "STARTS_WITH(" + caseAttr + ", '" + type + "')"
      // if there are more than one complaint types and given type is not last in the array, then append an OR
      if (complaintTypes.length > 1 && complaintTypes.indexOf(type) !== complaintTypes.length - 1) {
        $log.log(complaintTypes.indexOf(type));
        $log.log(complaintTypes.length - 1);
        queryString += " OR ";
      } else {
        queryString += ")";
      }
    }

    // https://data.cityofboston.gov/resource/wc8w-nujj$query=SELECT%20*%20WHERE%20open_dt%20%3E%20'2016-02-31T00%3A00%3A00'%20AND%20(STARTS_WITH(case_title%2C%20'Ground%20Maintenance')%20OR%20STARTS_WITH(case_title%2C%20'Request%20for%20Snow%20Plowing')%20OR%20STARTS_WITH(case_title%2C%20'Park%20Maintenance')%20OR%20STARTS_WITH(case_title%2C%20'Unsafe%2FDangerous%20Conditions')

    // var testString = "SELECT * WHERE open_dt > '2016-03-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(case_title, 'Metrolist Survery')";
    // var encodedQuery = encodeURIComponent(queryString);
    var encodedQuery = queryString;
    var orderer = "&$order=open_dt DESC";

    // var queryable = bostonUrl + "$query=" + encodedQuery;
    // var queryable = bostonUrl + "?$query=" + encodedQuery;
    var queryable = bostonUrl + "?$limit=100" + encodedQuery + orderer;
      //\\
      $log.log("full query url encoded:", queryable);
    return queryable;

    // return testString;
    // "SELECT * WHERE open_dt > '2016-01-01T00:00:00' AND case_status = 'Open' AND (STARTS_WITH(case_title, 'Ground Maintenance') OR STARTS_WITH(case_title, 'Request for Snow Plowing') OR STARTS_WITH(case_title, 'Park Maintenance') OR STARTS_WITH(case_title, 'Unsafe/Dangerous Conditions'))"
  }



  function asyncHTTP(queryable) {
    var defer = $q.defer();
    // var bostonUrl = 'https://data.cityofboston.gov/resource/wc8w-nujj.json';
    // var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json';
    // https://data.cityofboston.gov/resource/awu8-dc52.json
    // var bostonUrl = 'https://data.cityofboston.gov/resource/awu8-dc52.json?$limit=5' <--- it works!

    $http({
      method: 'GET',
      url: queryable,
      headers: {
        'X-App-Token': 'zdkQROnSL8UlsDCjuiBcc3VHq' //'k7chiGNz0GPFKd4dS03IEfKuE'
      }
      // , data: {
      //   '$limit' : '5'
      //   // '$query': query // "SELECT * WHERE open_dt > '2016-03-01T00:00:00' AND case_status = 'Open' AND STARTS_WITH(case_title, 'Metrolist Survery')" //query
      // }
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
                address: data.data[i].location,
                open_dt: data.data[i].open_dt
            });
        }
        defer.resolve(boston311MarkerInfos);
      }, function error311Query(err) {
        $log.log("Shit! Error. Status: " + err.status + "\n" + err.data);
        defer.reject({error: err});
      });

    return defer.promise;
  };

  var getFake311Data = function (complaintTypes) {
    var boston311MarkerInfosTESTES = [];
    var example = complainables.TESTES;
    for (var i = 0; i < example.length; i++) {
        var loc = {
            latitude: example[i].latitude,
            longitude: example[i].longitude
        };
        boston311MarkerInfosTESTES.push({
            id: "311" + i.toString(),
            description: example[i].case_title,
            location: loc,
            address: example[i].location,
            open_dt: example[i].open_dt
        });
    }
    return boston311MarkerInfosTESTES;
  }


  // Angular Factories, being singletons, have to return a thing.
  return {
    get311: getBoston311Data,
    get311Fake: getFake311Data
  };
});
