"use strict";
app.controller("MixDatabaseContextController", [
  "$scope",
  "$rootScope",
  "$location",
  "ngAppSettings",
  "$routeParams",
  "RestMixDatabaseContextService",
  function (
    $scope,
    $rootScope,
    $location,
    ngAppSettings,
    $routeParams,
    mixdbContextService
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      mixdbContextService
    );
    $scope.defaultAttr = null;
    $scope.databaseProvider = ["MySQL", "PostgreSQL", "SQLITE", "SQLSERVER"];
    $scope.actions = ["Delete"];
    // $scope.request.selects = 'id,title,name,createdDateTime';
    $scope.orders = [
      { title: "Id", value: "Id" },
      { title: "Name", value: "DisplayName" },
      { title: "Created Date", value: "CreatedDateTime" },
    ];
    $scope.request.orderBy = "CreatedDateTime";
    $scope.request.columns = "id,displayName,systemName,type,createdDatetime";
    $scope.request.searchColumns = "displayName,systemName";
    $scope.saveDatabase = function () {
      $scope.save($scope.viewmodel);
    };
    $scope.generateName = function () {
      $scope.viewmodel.systemName = $rootScope.generateKeyword(
        $scope.viewmodel.displayName,
        "_",
        true,
        true
      );
    };
    $scope.getSingleSuccessCallback = async function () {};
  },
]);
