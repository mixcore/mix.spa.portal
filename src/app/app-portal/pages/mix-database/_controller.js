"use strict";
app.controller("MixDatabaseController", [
  "$scope",
  "$rootScope",
  "$location",
  "ngAppSettings",
  "$routeParams",
  "RestMixDatabaseDataPortalService",
  "RestMixDatabaseColumnPortalService",
  "RestMixDatabasePortalService",
  function (
    $scope,
    $rootScope,
    $location,
    ngAppSettings,
    $routeParams,
    databaseDataService,
    databaseColumnService,
    databaseService
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      databaseService
    );
    $scope.defaultAttr = null;
    $scope.actions = ["Delete"];
    $scope.viewmodelType = "mix-database";
    // $scope.request.selects = 'id,title,name,createdDateTime';
    $scope.orders = [
      { title: "Id", value: "Id" },
      { title: "Name", value: "Name" },
      { title: "Created Date", value: "CreatedDateTime" },
    ];
    $scope.request.orderBy = "CreatedDateTime";
    $scope.request.columns = "id,displayName,systemName,type,createdDatetime";
    $scope.request.searchColumns = "displayName,systemName";
    $scope.saveDatabase = function () {
      $scope.save($scope.viewmodel);
    };
    $scope.getSingleSuccessCallback = async function () {
      if (!$scope.defaultAttr) {
        var getDefaultAttr = await databaseColumnService.getDefault();
        if (getDefaultAttr.success) {
          $scope.defaultAttr = getDefaultAttr.data;
          $scope.defaultAttr.options = [];
        }
        $scope.$apply();
      }
    };
    $scope.migrate = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await databaseService.migrate($scope.viewmodel);
        if (result.success) {
          $rootScope.showMessage(
            "Please restart pool to apply new db schema",
            "warning"
          );
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(["Cannot migrate database"]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.backup = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await databaseService.backup($scope.viewmodel);
        if (result.success) {
          $rootScope.showMessage(
            `Backup ${$scope.viewmodel.systemName} is queued`,
            "success"
          );
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(["Cannot backup database"]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.restore = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await databaseService.restore($scope.viewmodel);
        if (result.success) {
          $rootScope.showMessage(
            `Restore ${$scope.viewmodel.systemName} is queued`,
            "success"
          );
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(["Cannot restore database"]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.updateSchema = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await databaseService.updateSchema($scope.viewmodel);
        if (result.success) {
          $rootScope.showMessage(
            "Please restart pool to apply new db schema",
            "warning"
          );
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(["Cannot update database"]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
  },
]);
