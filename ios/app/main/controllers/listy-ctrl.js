'use strict';
angular.module('main')
.controller('ListyCtrl', function ($log, complainables, ThreeOneOne) {

  $log.log('Hello from your Controller: ListyCtrl in module main:. This is your controller:', this);

  var listyCtrl = this;

  function matchIcon (obj) {
    var desc = obj.description;
    var icon_path = '';

    var groundy = /ground/i;
    var snowy = /snow/i;
    var parky = /park/i;
    var dangery = /danger/i;

    if (desc.match(groundy)) {
      icon_path = 'main/assets/images/danger-hump.png';
    }
    else if (desc.match(snowy)) {
      icon_path = 'main/assets/images/snow_plow_truck.png';
    }
    else if (desc.match(parky)) {
      icon_path = 'main/assets/images/lawnmower.png';
    }
    else if (desc.match(dangery)) {
      icon_path = 'main/assets/images/falling-person.png';
    }
    else {
      icon_path = 'main/assets/images/snowflake-icon.png';
    }
    return icon_path;
  };

  function setIcons (objArray) {
    var dataWithIcons = [];

    for (var i = 0; i < objArray.length; i++) {
      var a = objArray[i];
      a.icon = matchIcon(a);
      dataWithIcons.push(a);
    }

    return dataWithIcons;
  };

  // listyCtrl.complaints = complainables.TESTES;
  ThreeOneOne.get311(complainables.GRIPES)
    .then(function (data) {
      var a = setIcons(data);
      listyCtrl.complaints = a;
    });

  // listyCtrl.complaints = setIcons(ThreeOneOne.get311Fake(complainables.GRIPES));

});
