"use strict";
var appShared = angular.module("MixShared", [
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "SharedComponents",
]);
var modules = angular.module("SharedComponents", []);
