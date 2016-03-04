'use strict';

describe('module: main, controller: ShowCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ShowCtrl;
  beforeEach(inject(function ($controller) {
    ShowCtrl = $controller('ShowCtrl');
  }));

  it('should do something', function () {
    expect(!!ShowCtrl).toBe(true);
  });

});
