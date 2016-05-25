'use strict';

angular.module('main')

.factory('Ref', ['$window', 'FBURL', function($window, FBURL) {
  return new $window.Firebase(FBURL);
}])

.factory('tooFirebase', function ($log, $http, $q, $rootScope, complainables, Utils, Geo, Ref, $firebaseArray) {
  $log.log('tooFirebase Factory in module main ready for action.');

  /*----------  Firebase refs  ----------*/
  var updatedRef = Ref.child('updated').child('too');
  var masterRef = Ref.child('tooMaster');
  var openCasesRef = Ref.child('tooOpenCases');
  var closedCasesRef = Ref.child('tooClosedCases');
  var tooTypesRef = Ref.child('tooTypes');
  var tooNeighborhoodsRef = Ref.child('tooNeighborhoods');
  /*----------  Firebase arrays  ----------*/
  var masterArray = $firebaseArray(masterRef);
  var openCasesArray = $firebaseArray(openCasesRef);
  var closedCasesArray = $firebaseArray(closedCasesRef);
  var tooTypesArray = $firebaseArray(tooTypesRef);
  var tooNeighborhoodsArray = $firebaseArray(tooNeighborhoodsRef);

  /*----------  Objectify  ----------*/
  function objectifyTOOMaster (obj) {
    var r = {};

    r.id = obj.case_enquiry_id;
    // r.case_id = obj.case_enquiry_id;
    r.type = obj.type;
    r.title = obj.case_title;
    r.status = obj.case_status;
    r.ontime_status = obj.ontime_status;
    r.open_dt = obj.open_dt;
    r.closed_dt = obj.closed_dt || null;
    r.location = {
      coords: {
        latitude: obj.latitude,
        longitude: obj.longitude
      },
      address: obj.location || null,
      short_address: obj.location_street_name || null,
      neighborhood: obj.neighborhood || null
    };
    r.image = null;
    r.icon_path = Utils.matchIcon(obj.type);

    return r;
  };

  /*----------  Push to Firebase  ----------*/
  function pushMaster (rawArray) {
    for (var i = 0; i < rawArray.length; i++) {
      masterRef.child(rawArray[i]['case_enquiry_id']).set(objectifyTOOMaster(rawArray[i]));
    }
  };

  // Delegate a big ol array of raw 311 data.
  // Will receive an array object, will return an array of property formatted objects.
  function handleTOOData (data) {
    var Data = data.data;
    pushMaster(Data);
  };

  function checkLastUpdated () {
    var defer = $q.defer();
    var isRecent = updatedRef.once('value', function (snap) {
      snap.ref().set({time: Firebase.ServerValue.TIMESTAMP});
      defer.resolve(true);
    }, function (err) {
      defer.reject(err);
    })
    // Update timestamp
    .then(function (ref) {
      ref.set({time: Firebase.ServerValue.TIMESTAMP});
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

  function handleError(err) {
    alert(err.status + '\n' + err.message);
    $log.log('Error: ', err.status, err.message);
  };

  var updateFirebase = function (query) {

    checkLastUpdated().then(function (bool) {
      if (bool) {
        getBoston311Data(query)
          .then(function (data) {
            handleTOOData(data);
          }, function (err) {
            handleError(err);
          });
      } else {
        $log.log('Not going to update firebase; the data is fresh enough.');
      }
    });

  };

  return {
    updateFirebase: updateFirebase
  };
});
