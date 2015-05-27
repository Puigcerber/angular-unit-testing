'use strict';

function MyController($scope, myService) {
  var vm = this;

  vm.hasError = false;
  vm.myProperty = 'My Controller';
  vm.myArray = [];
  vm.myObject = myService.syncCall();
  vm.myNumber = 0;
  vm.changeProperty = changeProperty;

  myService.asyncCall().then(
    function(data) {
      vm.myArray = data;
    },
    function() {
      vm.hasError = true;
    }
  );

  function changeProperty(value) {
    vm.myProperty = value;
  }

  $scope.$emit('my-event');

  $scope.$on('some-event', function() {
    vm.myNumber++;
  });

}

angular.module('myControllerModule', ['myServiceModule'])
  .controller('MyController', MyController);

