"use strict";
app.controller("ConfigurationController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ConfigurationService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
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
    $scope.cates = ngAppSettings.enums.configuration_cates;
    $scope.settings = $rootScope.globalSettings;
    $scope.request.category = $routeParams.category || "";
    $scope.getSingleSuccessCallback = function () {
      if (!$scope.viewModel.category) {
        $scope.viewModel.category = "Site";
      }
    };
    $scope.saveSuccessCallback = function () {
      commonService.initAllSettings().then(function () {
        // $location.url($scope.referrerUrl);
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };
    $scope.removeCallback = function () {
      commonService.initAllSettings().then(function () {
        $location.url($scope.referrerUrl);
      });
    };
  },
]);
