'use strict';

var app = angular.module('webApp', ['myControllerModule', 'myDirectiveModule', 'myProviderModule', 'myComponentModule']);

app.config(function (helloWorldProvider) {
  helloWorldProvider.configure('Pablo');
});

