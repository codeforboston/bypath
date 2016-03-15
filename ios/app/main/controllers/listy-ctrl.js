'use strict';
angular.module('main')
.controller('ListyCtrl', function ($scope, $rootScope, $log, Ref, toos, tooFirebase, opinions, $firebaseArray, MarkerFactory, BuildAQuery, Geolocation, Geo, here, complainables) {

  var listyCtrl = this;

  // testing 311 -> firebase updater
  var queer = BuildAQuery.boston311Query(100, 'Open', '2016-03-01', complainables.GRIPES);
  $log.log('qeer', queer);
  tooFirebase.updateFirebase(queer);


  listyCtrl.test = {};
  // listyCtrl.currentLocation = currentLocation;
  // Geolocation.get().then(function (location) {
  //   listyCtrl.test.loc = location.coords;
  // });
  // listyCtrl.test.loc = $rootScope.test.location;
  // Geolocation.get().then(function gotLoc (loc) {

      // listyCtrl.test.location = loc.coords.latitude;;
      listyCtrl.test.location = here.location.coords;
      listyCtrl.test.locArr = [here.location.coords.latitude, here.location.coords.longitude];
      listyCtrl.test.address = here.address;
      // listyCtrl.test.location = $rootScope.location.position;
      // listyCtrl.test.address = $rootScope.location.address;

  // });


  listyCtrl.test.test_img_src = 'main/assets/images/snowflake.png';

  // Root root resolution!
  // listyCtrl.complaints = MarkerFactory.parseDataToMarkers($rootScope.space.threeoneones);
  $rootScope.$watch('space.threeoneones', function updateList (newVal, oldVal) {
    $log.log('rootscope.space.threeoneones change registered in listyCtrl!');
    // listyCtrl.complaints = MarkerFactory.parseDataToMarkers($rootScope.space.threeoneones); //$rootScope.space.threeoneones;
  });

  listyCtrl.complaints = toos;

  // Get resolved opinions, too.
  listyCtrl.opinions = opinions;

  listyCtrl.slideIndex = 0;
  listyCtrl.slideChanged = function(index) { // Called each time the slide changes.
    listyCtrl.slideIndex = index;
    setViewTitle(listyCtrl.slideIndex);
  };
  function setViewTitle (index) {
    if (index === 0) {
      listyCtrl.viewTitle = '311 Notices';
    } else {
      listyCtrl.viewTitle = 'Public Advisories';
    }
  }
  setViewTitle(0);


  // geoables
  listyCtrl.distanceToHere = function (locObj) {
    // $log.log(locObj);
    var a = parseFloat(locObj.coords.latitude);
    var b = parseFloat(locObj.coords.longitude);
    var locArr = [a,b];
    return GeoFire.distance(locArr, listyCtrl.test.locArr);
    // return 4;
  };


  // listyCtrl.distanceToHere = function (id) {
  //   Geolocation.get().then(function (there) {
  //     // $log.log(there);
  //     Gelocation.get().then(function (here) {
  //       hereLat = here.coords.latitude;
  //       hereLon = here.coords.longitude;
  //       hereArr = [hereLat, hereLon];
  //       // $log.log('asdfasdfasdfadsf', there, here);
  //       return GeoFire.distance(there, hereArr);
  //     });
  //   }, function (err) {
  //     $log.log(err);
  //   });
  // };
  // distanceToHere('101001727324');

  // function getThere (id) {
  //   return var there = Geo.get(id);
  // };
  // function getHere () {
  //   return
  // };


  // votableables

  var upvotesRef = Ref.child('upvotes');
  var downvotesRef = Ref.child('downvotes');
  var upvotesFBArray = $firebaseArray(upvotesRef);
  var downvotesFBArray = $firebaseArray(downvotesRef);

  listyCtrl.getComplaintUpvotes = function (id) {
    var countable = upvotesFBArray.$getRecord(id);
    return countable;
  };
  listyCtrl.getComplaintDownvotes = function (id) {
    var countable = downvotesFBArray.$getRecord(id);
    return countable;
  };


  listyCtrl.upvote = function (id) {
    $log.log('upvote clicked');
    // increment upvotes for complaints ref
    var upvotesComplaintRef = Ref.child('upvotes').child(id);

    upvotesComplaintRef.transaction(function (count) {
      // if there is not upvotes here yet
      if (count === null) {
        return 1;
      } else {
        return count + 1;
      }
    }, function(error, committed, snapshot) {
      if (error) {
        $log.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        $log.log('We aborted the transaction.');
      } else {
        $log.log('Upvote incremented!!');
      }
      $log.log("Upvote data: ", snapshot.val());
    });
  };

  listyCtrl.downvote = function (id) {
    $log.log('upvote clicked');
    // increment upvotes for complaints ref
    var upvotesComplaintRef = Ref.child('downvotes').child(id);

    upvotesComplaintRef.transaction(function (count) {
      // if there is not upvotes here yet
      if (count === null ) {
        return 1;
      } else {
        return count + 1;
      }
    }, function(error, committed, snapshot) {
      if (error) {
        $log.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        $log.log('We aborted the transaction.');
      } else {
        $log.log('Downvote incremented!!');
      }
      $log.log("Downvote data: ", snapshot.val());
    });
  };

});
