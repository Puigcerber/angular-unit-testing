'use strict';

describe('Provider: helloWorld', function() {

  var helloWorldProvider;
  beforeEach(function() {
    module('myProviderModule', function(_helloWorldProvider_) {
        helloWorldProvider = _helloWorldProvider_;
      });
  });

  var helloWorld;
  beforeEach(inject(function(_helloWorld_) {
    helloWorld = _helloWorld_;
  }));

  it('should do something', function() {
    expect(!!helloWorldProvider).toBe(true);
  });

  describe('Service method', function() {

    beforeEach(function() {
      helloWorldProvider.configure('World');
    });

    it('should say hello world', function() {
      expect(helloWorld.sayHello()).toBe('Hello World');
    });

  });

});
