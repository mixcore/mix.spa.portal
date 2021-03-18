"use strict";
var app = angular.module("MixPortal", [
  "angularCroppie",
  "ui.bootstrap",
  "ngRoute",
  "components",
  "ngFileUpload",
  "LocalStorageModule",
  "bw.paging",
  "dndLists",
  "ngTagsInput",
  "ngSanitize",
  "MixShared",
]);
var modules = angular.module("components", []);
