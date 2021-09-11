"use strict";
app.controller("ConfigurationController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ConfigurationService",
  "ApiService",
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
    $scope.init = function () {
      $scope.request.category = $routeParams.category || "";
      $scope.getList();
    };
    $scope.getSingleSuccessCallback = function () {
      $scope.cates = ngAppSettings.enums.configuration_cates;
      $scope.globalSettings = $rootScope.globalSettings;
      $scope.request.category = $routeParams.category || "";
      if (!$scope.viewmodel.id) {
        $scope.viewmodel.property.dataType = "Text";
      }
      if (!$scope.viewmodel.category) {
        $scope.viewmodel.category = "Site";
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

    $scope.generateName = function () {
      $scope.viewmodel.keyword = $rootScope.generateKeyword(
        $scope.viewmodel.keyword,
        "_",
        true
      );
    };
  },
]);
