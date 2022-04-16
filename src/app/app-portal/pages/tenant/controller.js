"use strict";
app.controller("TenantController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "TenantRestService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    service
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.request.columns = [
      "id",
      "displayName",
      "systemName",
      "primaryDomain",
      "createdDateTime",
      "createdBy",
    ];
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
  },
]);
