﻿"use strict";
app.controller("ModuleGalleryController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ModuleGalleryService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    apiService,
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
    $scope.mixConfigurations = $rootScope.globalSettings;
    $scope.moduleContentId = $routeParams.id;
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";
    $scope.translate = $rootScope.translate;
    $scope.moduleContentId = $routeParams.id;
    $scope.getList = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.moduleContentId = $routeParams.id;
      $scope.request.query = "&moduleContentId=" + id;
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
    $scope.remove = function (moduleContentId, postId) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [moduleContentId, postId],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeConfirmed = async function (moduleContentId, postId) {
      $rootScope.isBusy = true;
      var result = await service.delete(moduleContentId, postId);
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
