'use strict';
angular.module('main')
.controller('ListyCtrl', function ($log, complainables, ThreeOneOne) {

  $log.log('Hello from your Controller: ListyCtrl in module main:. This is your controller:', this);

  var listyCtrl = this;

  // listyCtrl.complaints = complainables.TESTES;
  ThreeOneOne.get311(complainables.GRIPES)
    .then(function (data) {
      // var a = setIcons(data);
      listyCtrl.complaints = data;
    });

  // listyCtrl.complaints = setIcons(ThreeOneOne.get311Fake(complainables.GRIPES));

});
