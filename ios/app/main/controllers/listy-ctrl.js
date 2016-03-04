'use strict';
angular.module('main')
.controller('ListyCtrl', function ($rootScope, $log, Ref, opinions, $firebaseArray) {

  var listyCtrl = this;


  listyCtrl.test = {};
  listyCtrl.test.test_img_src = 'main/assets/images/snowflake.png';

  // Root root resolution!
  listyCtrl.complaints = $rootScope.threeoneones;
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
