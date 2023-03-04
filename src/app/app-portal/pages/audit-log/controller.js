"use strict";
app.controller("AuditLogController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "AuditLogRestService",
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
    // $scope.request.columns = [
    //   "id",
    //   "displayName",
    //   "host",
    //   "createdDateTime",
    //   "createdBy",
    // ];
    $scope.request.status = null;
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";

    $scope.view = function (item) {
      $rootScope.preview("object", item, null, "modal-lg");
    };
  },
]);
