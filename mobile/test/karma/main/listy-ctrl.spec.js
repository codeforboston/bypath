'use strict';

describe('module: main, controller: ListyCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ListyCtrl;
  beforeEach(inject(function ($controller) {
    ListyCtrl = $controller('ListyCtrl');
  }));

  it('should do something', function () {
    expect(!!ListyCtrl).toBe(true);
  });

});
