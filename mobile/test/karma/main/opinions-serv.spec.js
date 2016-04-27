'use strict';

describe('module: main, service: Opinions', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Opinions;
  beforeEach(inject(function (_Opinions_) {
    Opinions = _Opinions_;
  }));

  it('should do something', function () {
    expect(!!Opinions).toBe(true);
  });

});
