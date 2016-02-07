'use strict';

angular.module('myComponentModule', [])
  .component('myComponent', {
    bindings: {
      myBinding: '@'
    },
    controller: function() {
      this.myTitle = 'Unit Testing AngularJS';
    },
    template: '<h1>{{ $ctrl.myTitle }} {{ $ctrl.myBinding }}</h1>'
  });
