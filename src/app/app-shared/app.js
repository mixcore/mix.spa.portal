"use strict";
var appShared = angular.module("MixShared", [
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "SharedComponents",
]);
var sharedComponents = angular.module("SharedComponents", []);
