'use strict';

angular.module('main')

.factory('ThreeOneOne', function ($log, $http, $q, $rootScope, $firebaseArray, Utils, Geo, Ref) {

  /*----------  Testing to see what most commom complaint types are  ----------*/

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

  /*----------  Async http method to return json data  ----------*/
  function getBoston311Data(queryable) {
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

  /*----------  Add key, loc[] to geofire (for Geofire distance helper)  ----------*/
  var geoLastUpdateRef = Ref.child('updates').child('geo311').child('last');

  var checkLastUpdated = function () {
    geoLastUpdateRef.once('value', function (snap) {
      var snapVal = snap.val();
      // firebase timestamp is in milliseconds since unix epoc.
      var aDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      var now = parseInt(Firebase.ServerValue.TIMESTAMP);
      var withinADay = now - aDay;
      if (snapVal.time < withinADay) {
        // $log.log('updating cuz it aint fresh');
        return true;
      } else {
        // $log.log('geo311 data is fresh enough; not updateing');
      }
    });
  };

  var addToGeofire = function (key, locArray) {

    if (checkLastUpdated()) {
      geoLastUpdateRef.set({time: Firebase.ServerValue.TIMESTAMP});
      Geo.set(key, locArray).then(function () {
        $log.log('added to geofire case id: ' + key + ' at ' + locArray);
      });
    }
  };

  return {
    getBoston311Data: getBoston311Data,
    addToGeofire: addToGeofire,
    uniqueCases: uniqueThreeOneOneGripes
  };
});
