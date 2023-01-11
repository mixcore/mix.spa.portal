"use strict";
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
    $scope.cultures = $rootScope.globalSettings.cultures;
    $scope.settingTypes = [
      "Global",
      "Authentication",
      "Portal",
      "EPPlus",
      "IPSecurity",
      "MixHeart",
      "Quartz",
      "Smtp",
      "Endpoint",
      "Azure",
      "Ocelot",
      "Storage",
      "Queue",
      "Payments",
    ];
    $scope.type = "Global";
    $scope.getAppSettings = async function (type) {
      $rootScope.isBusy = true;
      $scope.type = type;
      $scope.appSettings = null;
      setTimeout(async () => {
        var resp = await appSettingsServices.getAppSettings($scope.type);
        if (resp && resp.success) {
          $scope.appSettings = JSON.stringify(resp.data, null, "\t");
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }, 200);
    };
    $scope.updateAppSettings = function (content) {
      $scope.appSettings = content;
    };
    $scope.loadAppSettings = async function () {
      $rootScope.isBusy = true;
      await $scope.getAppSettings("Global");

      await apiService.initAllSettings();
      $scope.mixConfigurations = $rootScope.mixConfigurations;
      $rootScope.isBusy = false;
      $scope.$apply();

      // load portal menus
      //   commonService.loadJsonData("portal-menus.json").then((resp) => {
      //     $scope.menus = resp.data.items;
      //     $rootScope.isBusy = false;
      //     $scope.$apply();
      //   });
    };

    $scope.stopApplication = async function () {
      $rootScope.isBusy = true;
      await commonService.stopApplication();
      $rootScope.showMessage("success", "success");
      $rootScope.isBusy = false;
      $scope.$apply();
    };
    $scope.clearCache = async function () {
      $rootScope.isBusy = true;
      await commonService.clearCache();
      $rootScope.showMessage("success", "success");
      $rootScope.isBusy = false;
      $scope.$apply();
    };
    $scope.saveAppSettings = async function (appSettings) {
      $rootScope.isBusy = true;
      var resp = await appSettingsServices.saveAppSettings(
        $scope.type,
        appSettings
      );
      if (resp && resp.success) {
        $scope.appSettings = resp.data;
        $rootScope.showMessage(
          "Please stop application to restart application pool",
          "warning"
        );
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
