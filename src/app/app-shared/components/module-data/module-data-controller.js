"use strict";
appShared.controller("SharedModuleDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$timeout",
  "$location",
  "AuthService",
  "SharedModuleDataService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $timeout,
    $location,
    authService,
    moduleDataService
  ) {
    $scope.request = {
      pageSize: "10",
      pageIndex: 0,
      status: "Published",
      orderBy: "CreatedDateTime",
      direction: "Desc",
      fromDate: null,
      toDate: null,
      keyword: "",
    };
    $scope.moduleDataFile = {
      file: null,
      fullPath: "",
      folder: "ModuleData",
      title: "",
      description: "",
    };
    $scope.activedModuleData = null;
    $scope.relatedModuleDatas = [];
    $rootScope.isBusy = false;
    $scope.data = {
      pageIndex: 0,
      pageSize: 1,
      totalItems: 0,
    };
    $scope.errors = [];

    $scope.range = function (max) {
      var input = [];
      for (var i = 1; i <= max; i += 1) input.push(i);
      return input;
    };

    $scope.getModuleData = async function (id) {
      $rootScope.isBusy = true;
      var resp = await moduleDataService.getModuleData(id, "portal");
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

    $scope.initModuleForm = async function (name) {
      var resp = null;
      $scope.name = name;
      if ($scope.id) {
        resp = await moduleDataService.getModuleData(
          $scope.id,
          $scope.dataId,
          "portal"
        );
      } else {
        resp = await moduleDataService.initModuleForm($scope.name);
      }

      if (resp && resp.success) {
        $scope.activedModuleData = resp.data;
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

    $scope.loadParams = async function () {
      $scope.dataId = $routeParams.id;
      $scope.backUrl =
        "/portal/module-data/list/" + $routeParams.moduleContentId;
      $scope.moduleContentId = $routeParams.moduleContentId;
    };

    $scope.loadModuleData = async function () {
      $rootScope.isBusy = true;
      var moduleContentId = $routeParams.moduleContentId;
      var id = $routeParams.id;
      var response = await moduleDataService.getModuleData(
        moduleContentId,
        id,
        "portal"
      );
      if (response.success) {
        $scope.activedModuleData = response.data;
        $rootScope.initEditor();
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadModuleDatas = async function (moduleContentId, pageIndex) {
      $scope.request.key = moduleContentId;
      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      if ($scope.request.fromDate !== null) {
        var d = new Date($scope.request.fromDate);
        $scope.request.fromDate = d.toISOString();
      }
      if ($scope.request.toDate !== null) {
        var d = new Date($scope.request.toDate);
        $scope.request.toDate = d.toISOString();
      }
      var resp = await moduleDataService.getModuleDatas($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
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

    $scope.removeModuleData = async function (id) {
      if (confirm("Are you sure!")) {
        var resp = await moduleDataService.removeModuleData(id);
        if (resp && resp.success) {
          $scope.loadModuleDatas();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
        }
      }
    };

    $scope.saveModuleData = async function () {
      var resp = await moduleDataService.saveModuleData(
        $scope.activedModuleData
      );
      if (resp && resp.success) {
        $scope.activedModuleData = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
        $rootScope.isBusy = false;
        $scope.initModuleForm($scope.name);
        $rootScope.isBusy = false;
        $scope.$apply();
        //$location.path('/portal/moduleData/details/' + resp.data.id);
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
