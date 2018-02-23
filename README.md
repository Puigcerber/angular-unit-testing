# AngularJS Unit Testing

Unit testing, as the name implies, is about testing individual units of code.

## About

This guide tries to show a few patterns and guidelines to help us with unit testing Angular applications after setting
some minimum configuration.

A more readable version was [published on Airpair](https://www.airpair.com/angularjs/posts/unit-testing-angularjs-applications)
and won the "Best AngularJS post" category of the 2015 Developer Writing Competition.
It has been shared more than 600 times on social media.

This repository contains also a complimentary [example project](example) with 100% test coverage.

## Table of Contents

* [Configuring](#configuring)
  * [ngMock](#ngmock)
  * [Karma](#karma)
    * [Templates](#templates)
    * [Coverage](#coverage)
* [Mocking](#mocking)
  * [Using $provide](#using-provide)
  * [Creating a provider mock](#creating-a-provider-mock)
* [Spying](#spying)
* [Testing](#testing)
  * [Controllers](#controllers)
  * [Services](#services)
  * [Directives](#directives)
  * [Providers](#providers)

## Configuring

### ngMock

Angular provides [ngMock](https://docs.angularjs.org/api/ngMock) to inject and mock services into unit tests. And one
of the most useful parts of `ngMock`  is `$httpBackend` which lets us mock XHR requests.

```
$ npm install angular-mocks --save-dev
```

### Karma

[Karma](http://karma-runner.github.io/) is a test runner which allow us to execute tests in multiple browsers.

```
# Install Karma:
$ npm install karma --save-dev

# Install plugins that our project needs:
$ npm install karma-jasmine jasmine-core karma-chrome-launcher --save-dev
```

After installing it we need to create a configuration
file running `karma init`.

And set the list of files that need to be loaded in the browser.

```js
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/**/*.js'
    ]
  });
};
```

#### Templates

When testing directives we need to set up Karma to serve our templates.

And for that we use a preprocessor to convert HTML into JS string.
[ng-html2js](https://github.com/karma-runner/karma-ng-html2js-preprocessor) creates a "templates" module and put the HTML
 into the `$templateCache`.

 ```
$ npm install karma-ng-html2js-preprocessor --save-dev
```

We need to add some lines to the Karma configuration.

```js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/*.html': ['ng-html2js']
    },

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'src/**/*.html',
    ],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'templates'
    }
  });
};
```

#### Coverage

It's great to identify which parts of our code are lacking test coverage and generate reports with
[Istanbul](https://github.com/gotwarlost/istanbul), that calculates the percentage of code accessed by tests.

```
$ npm install karma karma-coverage --save-dev
```

In the configuration file we need to exclude spec and mock files from the report.

```js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'src/**/!(*.mock|*.spec).js': ['coverage']
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      // output coverage reports
      dir : 'coverage/'
    }
  });
};
```

## Mocking

To test the functionality of a piece of code in isolation we need to mock any dependency.

Angular is written with testability in mind and come with [dependency injection](https://docs.angularjs.org/guide/di)
built in, what helps us to achieve decoupling and therefore to test our objects in isolation.

A service (service, factory, value, constant, or provider) is the most common type of dependency in Angular applications
and they are defined via providers.

The [injector](https://docs.angularjs.org/api/auto/service/$injector) retrieves object instances as defined by provider.
So there are at least two ways we can mock our services.

### Using $provide

We provide our own implementation in a `beforeEach` Jasmine block.

```js
var myService;
beforeEach(module(function($provide) {
  myService = {
    syncCall: function() {},
    asyncCall: function() {}
  };
  $provide.value('myService', myService);
}));
```

### Creating a provider mock

We create the implementation in a separate `my-service.service.mock.js` file so we can reuse it.

```js
angular.module('myServiceMock', [])
  .provider('myService', function() {
    this.$get = function() {
      return {
        syncCall: function() {},
        asyncCall: function() {}
      };
    };
  });
```

And later we load the mocked module in a `beforeEach` Jasmine block inside of our test suite.

```js
beforeEach(module('myServiceMock'));

var myService;
beforeEach(inject(function(_myService_) {
  myService = _myService_;
}));
```

It's good to **load the mocked modules after** the module we are testing to be sure the mock overrides the actual implementation.

## Spying

Using Jasmine we can [spy](http://jasmine.github.io/2.0/introduction.html#section-Spies) on functions tracking calls and
arguments passed.

```js
var myService;
beforeEach(inject(function(_myService_) {
  myService = _myService_;
  spyOn(myService, 'syncCall').and.callThrough();
}));
```

This comes handy in particular when the original implementation returned a promise.

```js
var myService;
var deferred;
beforeEach(inject(function($q, _myService_) {
  myService = _myService_;
  deferred = $q.defer();
  spyOn(myService, 'asyncCall').and.returnValue(deferred.promise);
}));
```

As we can emulate its behavior and later resolve or reject the [promise](https://docs.angularjs.org/api/ng/service/$q)
in our specs to test success and error calls.

```js
deferred.resolve();
deferred.reject();
```

## Testing

### Controllers

Controllers are easy to test as long as we don't manipulate the DOM and functions have a single and clear purpose.

We should test for the state, sync and async calls to services, and events.

```js
describe('Controller: MyController', function() {

  beforeEach(module('myControllerModule'));
  beforeEach(module('myServiceMock'));

  var myService;
  var deferred;
  // Mock services and spy on methods
  beforeEach(inject(function($q, _myService_) {
    deferred = $q.defer();
    myService = _myService_;
    spyOn(myService, 'syncCall').and.callThrough();
    spyOn(myService, 'asyncCall').and.returnValue(deferred.promise);
  }));

  var MyController;
  var scope;
  // Initialize the controller and a mock scope.
  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    spyOn(scope, '$emit');
    MyController = $controller('MyController', {
      $scope: scope,
      myService: myService
    });
  }));

  describe('State', function() {

    it('should expose myProperty to the view', function() {
      expect(MyController.myProperty).toBeDefined();
      // We can use Angular helpers.
      expect(angular.isArray(MyController.myArray)).toBe(true);
      expect(angular.isObject(MyController.myObject)).toBe(true);
      expect(angular.isNumber(MyController.myNumber)).toBe(true);
    });

    it('should expose a method to change myProperty', function() {
      expect(MyController.changeProperty).toBeDefined();
      expect(angular.isFunction(MyController.changeProperty)).toBe(true);
    });

    it('should change myProperty', function() {
      MyController.changeProperty(true);
      expect(MyController.myProperty).toBe(true);
      MyController.changeProperty(false);
      expect(MyController.myProperty).toBe(false);
    });

  });

  describe('Synchronous calls', function() {

    it('should call syncCall on myService', function() {
      expect(myService.syncCall).toHaveBeenCalled();
      expect(myService.syncCall.calls.count()).toBe(1);
    });

  });

  describe('Asynchronous calls', function() {

    it('should call asyncCall on myService', function() {
      expect(myService.asyncCall).toHaveBeenCalled();
      expect(myService.asyncCall.calls.count()).toBe(1);
    });

    it('should do something on success', function() {
      var data = ['something', 'on', 'success'];
      deferred.resolve(data);
      scope.$digest();
      // Check for state on success.
      expect(MyController.myArray).toBe(data);
    });

    it('should do something on error', function() {
      deferred.reject(400);
      scope.$digest();
      // Check for state on error.
      expect(MyController.hasError).toBe(true);
    });

  });

  describe('Events', function() {

    it('should emit an event', function() {
      expect(scope.$emit).toHaveBeenCalledWith('my-event');
      expect(scope.$emit.calls.count()).toBe(1);
    });

    it('should do something when some-event is caught', inject(function($rootScope) {
      $rootScope.$broadcast('some-event');
      // Check for state after event is caught.
      expect(MyController.myNumber).toBe(1);
    }));

  });

});
```

### Services

The complexity of testing services comes from the use of promises and their resolution.

In addition of testing calls to other services, we should test for the output of our methods and HTTP requests.
But as we don't want to send XHR requests to a real server we use
[$httpBackend](https://docs.angularjs.org/api/ngMock/service/$httpBackend).

```js
describe('Service: myService', function() {

  beforeEach(module('myServiceModule'));

  var myService;
  var httpBackend;
  beforeEach(inject(function($httpBackend, _myService_) {
    httpBackend = $httpBackend;
    myService = _myService_;
  }));

  describe('Output of methods', function() {

    it('should return the product of all positive integers less than or equal to n', function() {
      expect(myService.factorial(0)).toBe(1);
      expect(myService.factorial(5)).toBe(120);
      expect(myService.factorial(10)).toBe(3628800);
    });

  });

  describe('HTTP calls', function() {

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should call the API', function() {
      httpBackend.expectGET(/\/api\/things/).respond('');
      myService.getThings();
      httpBackend.flush();
    });

    it('should return an array of things on success', function() {
      var response = ['one thing', 'another thing'];
      var myThings = [];
      var errorStatus = '';
      var handler = {
        success: function(data) {
          myThings = data;
        },
        error: function(data) {
          errorStatus = data;
        }
      };
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();

      httpBackend.whenGET(/\/api\/things/).respond(response);
      myService.getThings().then(handler.success, handler.error);
      httpBackend.flush();

      expect(handler.success).toHaveBeenCalled();
      expect(myThings).toEqual(response);
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorStatus).toEqual('');
    });

  });

});
```

### Directives

Directives are a bit more complex to test as we need to [$compile](https://docs.angularjs.org/api/ng/service/$compile)
them manually to test the compiled DOM.

Additionally we use [angular.element](https://docs.angularjs.org/api/ng/function/angular.element) and the provided
jQuery or jqLite methods to manipulate the DOM.

And if needed we can test the directive controller grabbing an instance.

```js
describe('Directive: myDirective', function() {

  beforeEach(module('myDirectiveModule'));
  beforeEach(module('templates'));

  var element;
  var scope;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<my-directive something="thing"></my-directive>');
    element = $compile(element)(scope);
    scope.thing = {name: 'My thing'};
    scope.$apply();
  }));

  it('should render something', function() {
    var h1 = element.find('h1');
    expect(h1.text()).toBe('My thing');
  });

  it('should update the rendered text when scope changes', function() {
    scope.thing.name = 'My new thing';
    scope.$apply();
    var h1 = element.find('h1');
    expect(h1.text()).toBe('My new thing');
  });

  describe('Directive controller', function() {

    var controller;
    beforeEach(function() {
      controller = element.controller('myDirective');
    });

    it('should do something', function() {
      expect(controller.doSomething).toBeDefined();
      controller.doSomething();
      expect(controller.something.name).toBe('Do something');
    });

  });

});
```

### Providers

Providers are the toughest to test as we need to intercept them before they are injected.

Later we can test them as any other service.

```js
describe('Provider: myProvider', function() {

  beforeEach(module('myProviderModule'));

  var myProvider;
  beforeEach(function() {
    // Intercept the provider.
    module(function(_myProvider_) {
      myProvider = _myProvider_;
      });
    // Trigger the injection.
    inject();
  });

  it('should do something', function() {
    expect(!!myProvider).toBe(true);
  });

});
```
