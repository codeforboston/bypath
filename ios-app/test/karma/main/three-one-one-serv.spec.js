'use strict';

describe('module: main, service: ThreeOneOne', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ThreeOneOne;
  beforeEach(inject(function (_ThreeOneOne_) {
    ThreeOneOne = _ThreeOneOne_;
  }));

  it('should do something', function () {
    expect(!!ThreeOneOne).toBe(true);
  });

});
