'use strict';
angular.module('main').factory('FirebaseArrayListener', function ($firebaseArray) {
    var FirebaseArrayListener = $firebaseArray.$extend({
        // Nothing yet.
    });
    return function(ref) {
        return FirebaseArrayListener(ref);
    }
});
