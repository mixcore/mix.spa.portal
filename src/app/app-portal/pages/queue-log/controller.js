"use strict";
app.controller("QueueLogController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "AuthService",
  "QueueLogRestService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    authService,
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
    authService.fillAuthData();
    $scope.request.status = null;
    $scope.messages = [];
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
    $scope.getListSuccessCallback = function () {
      angular.forEach($scope.data.items, function (e) {
        switch (e.state) {
          case "ACK":
            e.objClass = "text-success";
            break;
          case "NACK":
            e.objClass = "text-warning";
            break;
          case "FAILED":
            e.objClass = "text-danger";
            break;
          default:
            e.objClass = "text-info";
            break;
        }
      });
    };
    $scope.view = function (item) {
      switch (item.state) {
        case "ACK":
          item.objClass = "text-success";
          break;
        case "NACK":
          item.objClass = "text-warning";
          break;
        case "FAILED":
          item.objClass = "text-danger";
          break;
        default:
          item.objClass = "text-info";
          break;
      }
      $rootScope.preview("object", item, null, "modal-lg");
    };
  },
]);
