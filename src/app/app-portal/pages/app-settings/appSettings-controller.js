﻿"use strict";
app.controller("AppSettingsController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$timeout",
  "$location",
  "AuthService",
  "ApiService",
  "CommonService",
  "AppSettingsServices",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $timeout,
    $location,
    authService,
    apiService,
    commonService,
    appSettingsServices
  ) {
    $scope.appSettings = null;
    $scope.errors = [];
    $scope.statuses = ngAppSettings.contentStatuses;
    $scope.getAppSettings = async function (id) {
      $rootScope.isBusy = true;
      var resp = await appSettingsServices.getAppSettings();
      if (resp && resp.success) {
        $scope.appSettings = JSON.stringify(resp.data);
        $rootScope.initEditor();
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.loadAppSettings = async function () {
      $rootScope.isBusy = true;

      var response = await appSettingsServices.getAppSettings();
      if (response && response.success) {
        $scope.appSettings = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response?.errors || ["Failed"]);
        $rootScope.isBusy = false;
        $scope.$apply();
      }

      await apiService.initAllSettings();
      $scope.mixConfigurations = $rootScope.mixConfigurations;
      $rootScope.isBusy = false;
      $scope.$apply();

      // load portal menus
      commonService.loadJsonData("portal-menus.json").then((resp) => {
        $scope.menus = resp.data.items;
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };

    $scope.saveAppSettings = async function (appSettings) {
      $rootScope.isBusy = true;
      var resp = await appSettingsServices.saveAppSettings(appSettings);
      if (resp && resp.success) {
        $scope.appSettings = resp.data;
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $scope.$apply();
      }
    };
  },
]);
