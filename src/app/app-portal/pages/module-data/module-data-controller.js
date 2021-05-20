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
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.moduleId = $routeParams.moduleId;
    $scope.backUrl = `/portal/module-data/list/${$scope.moduleId}`;
    $scope.module = null;
    $scope.dataColumns = [];
    $scope.editDataUrl = "/portal/module-data/details/" + $scope.moduleId;
    $scope.init = async function () {
      $scope.id = $routeParams.id;
      if (!$scope.module) {
        var getModule = await moduleService.getSingle([$scope.moduleId]);
        if (getModule.isSucceed) {
          $scope.module = getModule.data;
          angular.forEach($scope.module.columns, function (e, i) {
            if (e.isDisplay) {
              $scope.dataColumns.push({
                title: e.title,
                name: e.name,
                datatype: e.dataType,
                filter: true,
                type: 0, // string - ngAppSettings.dataTypes[0]
              });
            }
          });
          $scope.$apply();
        }
      }
    };
    $scope.getList = async function () {
      $rootScope.isBusy = true;
      $scope.request.module_id = $scope.moduleId;
      var response = await service.getList($scope.request);
      if (response.isSucceed) {
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
      $scope.request.module_id = $scope.moduleId;
      var response = await service.export($scope.request);
      if (response.isSucceed) {
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
      if (resp && resp.isSucceed) {
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
    $scope.remove = function (dataId) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [dataId],
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

    $scope.removeCallback = function () {};

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
