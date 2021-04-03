"use strict";
app.controller("ServiceController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "RestMixDatabasePortalService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    commonService
  ) {
    BaseODataCtrl.call(
      this,
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.defaultId = "default";
    $scope.parentId = null;
    $scope.parentType = null;
    $scope.cates = ["Site", "System"];
    $scope.others = [];
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
    $scope.init = async function () {
      $scope.mixDatabaseId = $routeParams.mixDatabaseId;
      $scope.mixDatabaseName = $routeParams.mixDatabaseName;
      $scope.dataId = $routeParams.dataId;
    };
    $scope.saveSuccessCallback = function () {
      $rootScope.isBusy = false;
      $scope.$apply();
      // if($scope.parentId){
      //     $location.url('/portal/mix-database-data/details?dataId='+ $scope.parentId);
      // }
      // else{
      //     $location.url('/portal/mix-database-data/list?mixDatabaseId='+ $scope.viewmodel.mixDatabaseId);
      // }
    };
    $scope.getList = async function () {
      $rootScope.isBusy = true;
      $scope.mixDatabaseId = $routeParams.mixDatabaseId;
      $scope.mixDatabaseName = $routeParams.mixDatabaseName;
      var type = $routeParams.type;
      var parentId = $routeParams.parentId;
      var response = await service.getList(
        "read",
        $scope.request,
        $scope.mixDatabaseId,
        $scope.mixDatabaseName,
        type,
        parentId
      );
      $scope.canDrag =
        $scope.request.orderBy !== "Priority" ||
        $scope.request.direction !== "0";
      if (response) {
        $scope.data = response;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors("Failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.getSingle = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id || $scope.defaultId;
      $scope.mixDatabaseId = $routeParams.mixDatabaseId;
      $scope.mixDatabaseName = $routeParams.mixDatabaseName;
      var resp = await service.getSingle("portal", [
        id,
        $scope.mixDatabaseId,
        $scope.mixDatabaseName,
      ]);
      if (resp) {
        $scope.viewmodel = resp;
        $scope.viewmodel.parentType = $scope.parentType;
        $scope.viewmodel.parentId = $scope.parentId;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors("Failed");
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.preview = function (item) {
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.edit = function (data) {
      $scope.goToPath(
        "/portal/mix-database-data/details?dataId=" +
          data.id +
          "&mixDatabaseId=" +
          $scope.mixDatabaseId
      );
    };
    $scope.remove = function (data) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [data.id],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeConfirmed = async function (dataId) {
      $rootScope.isBusy = true;
      var result = await service.delete([dataId]);
      if (result.isSucceed) {
        if ($scope.removeCallback) {
          $rootScope.executeFunctionByName(
            "removeCallback",
            $scope.removeCallbackArgs,
            $scope
          );
        }
        $scope.getList();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.saveOthers = async function () {
      var response = await service.saveList($scope.others);
      if (response.isSucceed) {
        $scope.getList();
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
