'use strict';

describe('module: main, controller: OpinionatorCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var OpinionatorCtrl;
  beforeEach(inject(function ($controller) {
    OpinionatorCtrl = $controller('OpinionatorCtrl');
  }));

  it('should do something', function () {
    expect(!!OpinionatorCtrl).toBe(true);
  });

});
