'use strict';

angular.module('myServiceMock', [])
  .provider('myService', function() {
    this.$get = function() {
      return {
        syncCall: function() {
          return {};
        },
        asyncCall: function() {}
      };
    };
  });