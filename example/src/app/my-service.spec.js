'use strict';

describe('Service: myService', function() {

  beforeEach(module('myServiceModule'));

  var myService;
  var httpBackend;
  beforeEach(inject(function($httpBackend, _myService_){
    httpBackend = $httpBackend;
    myService = _myService_;
  }));

  describe('Output of methods', function() {

    it('should return the product of all positive integers less than or equal to n', function() {
      expect(myService.factorial(0)).toBe(1);
      expect(myService.factorial(5)).toBe(120);
      expect(myService.factorial(10)).toBe(3628800);
    });

    it('should return an object', function() {
      expect(angular.isObject(myService.syncCall())).toBe(true);
    });

  });

  describe('HTTP calls', function() {

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should call the API', function() {
      httpBackend.expectGET(/\/users/).respond('');
      myService.asyncCall();
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

      httpBackend.whenGET(/\/users/).respond(response);
      myService.asyncCall().then(handler.success, handler.error);
      httpBackend.flush();

      expect(handler.success).toHaveBeenCalled();
      expect(myThings).toEqual(response);
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorStatus).toEqual('');
    });

    it('should return the status on error', function() {
      var errorStatus = '';
      var myThings = [];
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

      httpBackend.whenGET(/\/users/).respond(404, {status: 404});
      myService.asyncCall().then(handler.success, handler.error);
      httpBackend.flush();

      expect(handler.error).toHaveBeenCalled();
      expect(errorStatus).toEqual(404);
      expect(handler.success).not.toHaveBeenCalled();
      expect(myThings).toEqual([]);
    });

  });

});
