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
      let backUrl = "/admin/role/list";
      $scope.createUrl = `/admin/mix-database-data/create?mixDatabaseName=sysPermission&dataContentId=default&guidParentId=${$scope.viewmodel.id}&parentType=Role&backUrl=${backUrl}`;
      $scope.updateUrl = "/admin/mix-database-data/details";
    };

    $scope.createRole = async function () {
      $rootScope.isBusy = true;
      var result = await service.createRole($scope.role.name);
      if (result.success) {
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
