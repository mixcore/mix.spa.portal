"use strict";
var app = angular.module("MixInit", [
  "ui.bootstrap",
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "components",
  "MixShared",
]);
var modules = angular.module("components", []);
