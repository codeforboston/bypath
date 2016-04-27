'use strict';
angular.module('main')
.factory('tooFirebase', function ($log, $http, $q, $rootScope, complainables, Utils, Geo, Ref, $firebaseArray) {
  //\\
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
  // Extract relevant attributes and format accordingly.
  function objectifyTOOMaster (obj) {

    // $key: {  // <-- Firebase auto-generated via .$add({foo:bar}) or .push({foo:bar}), ie -KYEOAr23i12380KL-JrIT
    //   case_id: 123352355245, // <case_enquiry_id>
    //   type: 'Sidewalk Repair (Make Safe)', // <type>
    //   case_title: 'Sidewalk Repair (Make Safe)', // <case_title>
    //   status: 'Open', // <CASE_STATUS>
    //   ontime_status: 'Overdue', // <OnTime_Status>
    //   open_dt: '2123lT1239a099:99', // <open_dt>
    //   closed_dt: '12123923842302', // <closed_dt>
    //   location: { // parsed and objectified from <LATITUDE> and <LONGITUDE>
    //     coords: {
    //       latitude: 42.342345234,
    //       longitude: 72.123123123,
    //     }
    //     address: '1 Main Street, Cambridge MA 02123', // <LOCATION>
    //     short_address: '1 Main Street', // <LOCATION_STREET_**name**>
    //     neighborhood: 'asdfas', // <NEIGHBORHOOD>
    //   },
    //   image: 'xasdiafalskdjf;alksjf;alksjdf;as' // base 64 img data; will be blank for 311, useful for PA's
    // }

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
  // this will push to firebase all the data acquired as designated by the query builder

  function pushMaster (rawArray) {
    // var formattedArray = [];

    // For each element in raw 311 data, format it the way we want it.
    // for (var i = 0; i < rawArray.length; i++) {
    //   formattedArray.push(objectifyTOOMaster(rawArray[i]));
    // }

    // Set formatted FB data as an array.
    // masterArray.push(formattedArray); // or .$add ?
    for (var i = 0; i < rawArray.length; i++) {
      // masterArray.$add(objectifyTOOMaster(rawArray[i]));
      masterRef.child(rawArray[i]['case_enquiry_id']).set(objectifyTOOMaster(rawArray[i]));
    }
  };

  function pushOpen (array) {

  };

  function pushClosed (array) {

  };

  function pushTypes (array) {

  };

  function pushNeighborhoods (array) {

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
      // var exists = snap.exists();

      snap.ref().set({time: Firebase.ServerValue.TIMESTAMP});
      defer.resolve(true);


      // var Snap = snap.val();

      // // Set relative times.
      // // var aDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      // var aDay = 1; // test
      // var now = parseInt(Firebase.ServerValue.TIMESTAMP);
      // var withinADay = now - aDay;
      // $log.log('Snap.time', Snap.time, 'withinADay', withinADay, 'now', now);
      // if (Snap.time > withinADay) {
      //   $log.log('Updating firebase with fresh 311 data.');
      //   defer.resolve(true);
      // } else {
      //   $log.log('Not updating firebase with 311 data; data is fresh enough.');
      //   defer.resolve(false);
      // }





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
