'use strict';

angular.module('myProviderModule')
  .directive('btnHelloWorld', function($window, helloWorld) {
    return {
      restrict: 'E',
      template: '<button ng-click="onClick()">Hi!</button>',
      link: function(scope) {
        scope.onClick = function() {
          $window.alert(helloWorld.sayHello());
        };
      }
    };
  });