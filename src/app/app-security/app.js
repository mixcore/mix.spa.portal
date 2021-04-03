"use strict";
var app = angular.module("MixSecurity", [
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "components",
  "MixShared",
]);
var modules = angular.module("components", []);
