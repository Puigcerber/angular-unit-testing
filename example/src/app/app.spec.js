'use strict';

describe('Module: webApp', function() {

  var helloWorldProvider;
  beforeEach(function() {
    // Spy on the provider.
    module('myProviderModule', function(_helloWorldProvider_) {
      helloWorldProvider = _helloWorldProvider_;
      spyOn(helloWorldProvider, 'configure');
    });
    // Load the module.
    module('webApp');
    // Trigger the injection.
    inject();
  });

  it('should configure the provider', function() {
    expect(helloWorldProvider.configure).toHaveBeenCalled();
  });

});
