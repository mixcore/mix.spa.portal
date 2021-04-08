"use strict";
app.controller("MixDatabaseController", [
  "$scope",
  "$rootScope",
  "$location",
  "ngAppSettings",
  "$routeParams",
  "RestMixDatabaseColumnPortalService",
  "RestMixDatabasePortalService",
  function (
    $scope,
    $rootScope,
    $location,
    ngAppSettings,
    $routeParams,
    mixDatabaseColumnService,
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
      var getDefaultAttr = await mixDatabaseColumnService.getDefault();
      if (getDefaultAttr.isSucceed) {
        $scope.defaultAttr = getDefaultAttr.data;
        $scope.defaultAttr.options = [];
      }
      $scope.$apply();
    };
    $scope.migrate = async function () {
      if ($scope.viewmodel.id) {
        $rootScope.isBusy = true;
        var result = await service.migrate($scope.viewmodel);
        $scope.handleResult(result);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
