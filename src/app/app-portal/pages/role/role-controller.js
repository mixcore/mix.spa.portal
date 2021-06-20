"use strict";
app.controller("RoleController", [
  "$scope",
  "$rootScope",
  "$location",
  "$routeParams",
  "ngAppSettings",
  "RestMixDatabaseDataPortalService",
  "RestMixDatabaseColumnPortalService",
  "RoleService",
  function (
    $scope,
    $rootScope,
    $location,
    $routeParams,
    ngAppSettings,
    dataService,
    columnService,
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
    $scope.role = { name: "" };
    $scope.initPermissions = async function () {
      let backUrl = "/portal/role/list";
      $scope.createUrl = `/portal/mix-database-data/create?mixDatabaseName=sys_permission&dataId=default&parentId=${$scope.viewmodel.id}&parentType=Role&backUrl=${backUrl}`;
      $scope.updateUrl = "/portal/mix-database-data/details";
    };

    $scope.createRole = async function () {
      $rootScope.isBusy = true;
      var result = await service.createRole($scope.role.name);
      if (result.isSucceed) {
        $scope.role.name = "";
        $scope.getList();
      } else {
        $rootScope.showErrors(result.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
