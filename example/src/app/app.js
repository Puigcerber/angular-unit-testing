'use strict';

var app = angular.module('webApp', ['myControllerModule', 'myDirectiveModule', 'myProviderModule']);

app.config(function (helloWorldProvider) {
  helloWorldProvider.configure('Pablo');
});

