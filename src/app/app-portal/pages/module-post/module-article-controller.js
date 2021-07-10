﻿"use strict";
app.controller("ModulePostController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ModulePostRestService",
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
    BaseCtrl.call(
      this,
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.cates = ["Site", "System"];
    $scope.others = [];
    $scope.mixConfigurations = $rootScope.appSettings;
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
    $scope.translate = $rootScope.translate;
    $scope.moduleIds = $routeParams.moduleIds || $routeParams.id;
    $scope.pageIds = $routeParams.page_ids;
    $scope.type = $routeParams.type;
    $scope.getList = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.moduleId = $routeParams.id;
      $scope.request.query = "&module_id=" + id;
      $scope.canDrag =
        $scope.request.orderBy !== "Priority" ||
        $scope.request.direction !== "0";
      var response = await service.getList($scope.request);
      if (response.success) {
        $scope.data = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.preview = function (item) {
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.remove = function (moduleId, postId) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [moduleId, postId],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeConfirmed = async function (moduleId, postId) {
      $rootScope.isBusy = true;
      var result = await service.delete(moduleId, postId);
      if (result.success) {
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

    $scope.removeCallback = function () {};

    $scope.saveOthers = async function () {
      var response = await service.saveList($scope.others);
      if (response.success) {
        $scope.getList();
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateInfos = async function (index) {
      $scope.data.items.splice(index, 1);
      $rootScope.isBusy = true;
      var startIndex = $scope.data.items[0].priority - 1;
      for (var i = 0; i < $scope.data.items.length; i++) {
        $scope.data.items[i].priority = startIndex + i + 1;
      }
      var resp = await service.updateInfos($scope.data.items);
      if (resp && resp.success) {
        $scope.activedPage = resp.data;
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
