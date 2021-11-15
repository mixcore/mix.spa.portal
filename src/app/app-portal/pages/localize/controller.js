"use strict";
app.controller("LocalizeController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "LocalizeService",
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

    $scope.getSingleSuccessCallback = function () {
      $scope.cates = ngAppSettings.enums.configuration_cates;
      $scope.appSettings = $rootScope.appSettings;
      $scope.request.category = $routeParams.category || "";
      if (!$scope.viewmodel.id) {
        $scope.viewmodel.dataType = "Text";
      }
      if (!$scope.viewmodel.category) {
        $scope.viewmodel.category = "Site";
      }
    };
    $scope.saveSuccessCallback = function () {
      apiService.getAllSettings().then(function () {
        // $location.url($scope.referrerUrl);
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };
    $scope.removeCallback = function () {
      apiService.getAllSettings().then(function () {
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
