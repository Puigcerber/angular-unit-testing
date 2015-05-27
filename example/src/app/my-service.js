'use strict';

function MyService($http, $q) {

  var f = [];

  this.factorial = factorial;
  this.syncCall = syncCall;
  this.asyncCall = asyncCall;

  function factorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    if (f[n] > 0) {
      return f[n];
    }
    f[n] = factorial(n-1) * n;
    return f[n];
  }

  function syncCall() {
    return {
      name: 'Synchronous Call'
    };
  }

  function asyncCall() {
    return $http.get('http://jsonplaceholder.typicode.com/users').then(
      function(response) {
        return response.data;
      },
      function(error) {
        return $q.reject(error.status);
      }
    );
  }

}

angular.module('myServiceModule', [])
  .service('myService', MyService);