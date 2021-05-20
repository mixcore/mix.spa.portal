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
    $scope.cates = [];
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.defaultId = "default";
    $scope.languageFile = {
      file: null,
      fullPath: "",
      folder: "Language",
      title: "",
      description: "",
    };
    $scope.dataTypes = $rootScope.globalSettings.dataTypes;
    $scope.$on("$viewContentLoaded", function () {
      $scope.cates = ngAppSettings.enums.language_cates;
      $scope.localizeSettings = $rootScope.globalSettings;
      $scope.cate = $scope.cates[0];
    });
    $scope.getSingleSuccessCallback = function () {
      $scope.viewmodel.category = "Site";
    };
    $scope.saveSuccessCallback = function () {
      commonService.initAllSettings().then(function () {
        $location.url($scope.referrerUrl || "/portal/localize/list");
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };
    $scope.removeCallback = function () {
      commonService.initAllSettings().then(function () {
        // $location.url($scope.referrerUrl);
      });
    };
    $scope.generateDefault = function (text, cate) {
      if (!$routeParams.id && !$scope.viewmodel.keyword) {
        $scope.viewmodel.defaultValue = text;
        $scope.viewmodel.keyword =
          cate.prefix +
          text
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/([0-9])([^0-9])/g, "$1-$2")
            .replace(/([^0-9])([0-9])/g, "$1-$2")
            .replace(/-+/g, "_")
            .toLowerCase();
      }
    };
  },
]);
