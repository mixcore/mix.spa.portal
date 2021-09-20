"use strict";
var appShared = angular.module("MixShared", [
  "ngRoute",
  "ngFileUpload",
  "LocalStorageModule",
  "SharedComponents",
]);
var sharedComponents = angular.module("SharedComponents", []);
window.executeFunctionByName = async function (
  functionName,
  args,
  context = window
) {
  if (functionName !== null) {
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    functionName = null;
    return context[func].apply(this, args);
  }
};
