'use strict';

describe('Controller: MyController', function() {

  beforeEach(module('myControllerModule'));
  beforeEach(module('myServiceMock'));

  var myService;
  var deferred;
  // Mock services and spy on methods
  beforeEach(inject(function($q, _myService_){
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
      expect(MyController.myArray).toBe(data);
    });

    it('should do something on error', function() {
      deferred.reject(400);
      scope.$digest();
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
      expect(MyController.myNumber).toBe(1);
    }));

  });

});