"use strict";
app.controller("AppSecurityController", [
  "$rootScope",
  "$scope",
  "ApiService",
  "AuthService",
  "TranslatorService",
  "AppSettingsService",
  function (
    $rootScope,
    $scope,
    apiService,
    authService,
    translatorService,
    appSettingsService
  ) {
    $scope.isInit = false;
    $scope.pageTagName = "";
    $scope.pageTagTypeName = "";
    $scope.pageTagType = 0;
    $scope.isAdmin = false;
    $scope.translator = translatorService;
    $rootScope.appSettingsService = appSettingsService;
    $scope.lang = null;
    $scope.mixConfigurations = {};
    $scope.portalThemeSettings = {};
    $scope.init = function () {
      if (!$rootScope.isBusy) {
        $rootScope.isBusy = true;
        apiService.getAllSettings($scope.lang).then(function () {
          $scope.isInit = true;
          $rootScope.isBusy = false;
          $scope.$apply();
        });
      }
    };
  },
]);
