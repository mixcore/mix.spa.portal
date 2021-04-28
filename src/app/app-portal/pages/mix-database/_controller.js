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
    // $scope.request.selects = 'id,title,name,createdDateTime';
    $scope.orders = [
      { title: "Id", value: "id" },
      { title: "Name", value: "name" },
      { title: "Created Date", value: "createdDateTime" },
    ];
    $scope.request.orderBy = "createdDateTime";
    $scope.getSingleSuccessCallback = async function () {
      var getDefaultAttr = await databaseColumnService.getDefault();
      if (getDefaultAttr.isSucceed) {
        $scope.defaultAttr = getDefaultAttr.data;
        $scope.defaultAttr.options = [];
      }
      $scope.$apply();
    };
    $scope.migrate = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await databaseService.migrate($scope.viewmodel);
        if (result.isSucceed) {
          var migrateData = await databaseDataService.migrate(
            $scope.viewmodel.id
          );
          $scope.handleResult(migrateData);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(["Cannot migrate database"]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
  },
]);
