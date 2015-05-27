'use strict';

describe('Directive: myDirective', function() {

  beforeEach(module('myProviderModule'));

  var element;
  var scope;
  var window;
  beforeEach(inject(function ($rootScope, $compile, $window) {
    scope = $rootScope.$new();
    element = angular.element('<btn-hello-world></btn-hello-world>');
    element = $compile(element)(scope);
    window = $window;
    spyOn(window, 'alert');
  }));

  it('should render a button', function() {
    var button = element.find('button');
    expect(button.text()).toBe('Hi!');
  });

  it('should alert something', function() {
    scope.onClick();
    expect(window.alert).toHaveBeenCalled();

  });

});
