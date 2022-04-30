"use strict";
app.controller("ModuleDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ModuleDataRestService",
  "ModuleRestService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    moduleService,
    commonService
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
    // $scope.request.orderBy = "Priority";
    // $scope.request.direction = "Asc";
    $scope.cates = ["Site", "System"];
    $scope.others = [];
    $scope.mixConfigurations = $rootScope.globalSettings;
    $scope.moduleContentId = $routeParams.moduleContentId;
    $scope.backUrl = `/portal/module-data/list/${$scope.moduleContentId}`;
    $scope.module = null;
    $scope.columns = [];
    $scope.editDataUrl =
      "/portal/module-data/details/" + $scope.moduleContentId;
    $scope.init = async function () {
      $scope.id = $routeParams.id;
    };
    $scope.initList = async function () {
      $scope.id = $routeParams.id;
      if (!$scope.module) {
        var getModule = await moduleService.getSingle([$scope.moduleContentId]);
        if (getModule.success) {
          $scope.module = getModule.data;
          $scope.columns = $scope.module.columns;
          $scope.$apply();
        }
      }
    };
    $scope.getList = async function () {
      $rootScope.isBusy = true;
      $scope.request.moduleContentId = $scope.moduleContentId;
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

    $scope.export = async function () {
      $rootScope.isBusy = true;
      $scope.request.moduleContentId = $scope.moduleContentId;
      var response = await service.export($scope.request);
      if (response.success) {
        window.top.location = response.data.webPath;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.getSingle = async function () {
      $rootScope.isBusy = true;
      var resp = await service.getSingle($routeParams.id, "portal");
      if (resp && resp.success) {
        $scope.activedModuleData = resp.data;
        $rootScope.initEditor();
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
    $scope.remove = function (dataContentId) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [dataContentId],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeConfirmed = async function (dataContentId) {
      $rootScope.isBusy = true;
      var result = await service.delete([dataContentId]);
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
        $rootScope.showErrors(result.errors);
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
  },
]);
