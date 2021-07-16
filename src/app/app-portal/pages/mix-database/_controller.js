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
      { title: "Id", value: "Id" },
      { title: "Name", value: "Name" },
      { title: "Created Date", value: "CreatedDateTime" },
    ];
    $scope.request.orderBy = "CreatedDateTime";
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
