'use strict';

function helloWorld() {
  var name;
  return {
    configure: function(value) {
      name = value;
    },
    $get: function() {
      return {
        sayHello: function() {
          return 'Hello ' + name;
        }
      };
    }
  };
}

angular.module('myProviderModule')
  .provider('helloWorld', helloWorld);
