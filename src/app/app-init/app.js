"use strict";
var app = angular.module("MixInit", [
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "components",
  "MixShared",
]);
var modules = angular.module("components", []);
