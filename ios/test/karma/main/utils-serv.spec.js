'use strict';

describe('module: main, service: Utils', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Utils;
  beforeEach(inject(function (_Utils_) {
    Utils = _Utils_;
  }));

  it('should do something', function () {
    expect(!!Utils).toBe(true);
  });

});
