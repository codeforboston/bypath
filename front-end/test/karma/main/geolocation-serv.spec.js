'use strict';

describe('module: main, service: Geolocation', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Geolocation;
  beforeEach(inject(function (_Geolocation_) {
    Geolocation = _Geolocation_;
  }));

  it('should do something', function () {
    expect(!!Geolocation).toBe(true);
  });

});
