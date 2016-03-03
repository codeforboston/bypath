'use strict';

describe('module: main, controller: MappyCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var MappyCtrl;
  beforeEach(inject(function ($controller) {
    MappyCtrl = $controller('MappyCtrl');
  }));

  it('should do something', function () {
    expect(!!MappyCtrl).toBe(true);
  });

});
