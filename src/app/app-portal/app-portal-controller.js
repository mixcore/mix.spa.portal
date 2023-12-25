"use strict";
app.controller("AppPortalController", [
  "$rootScope",
  "$scope",
  "ngAppSettings",
  "$location",
  "ApiService",
  "CommonService",
  "AuthService",
  "TranslatorService",
  "AppSettingsService",
  "localStorageService",
  function (
    $rootScope,
    $scope,
    ngAppSettings,
    $location,
    apiService,
    commonService,
    authService,
    translatorService,
    appSettingsService,
    localStorageService
  ) {
    BaseHub.call(this, $scope);
    $scope.host = `${$rootScope.globalSettings.domain}/${$scope.host}`;
    $scope.isInit = false;
    $scope.pageTagName = "";
    $scope.pageTagTypeName = "";
    $scope.pageTagType = 0;
    $scope.isAdmin = false;
    $scope.translator = translatorService;
    $rootScope.globalSettingsService = appSettingsService;
    $scope.lang = null;
    $scope.mixConfigurations = {};
    $scope.portalThemeSettings = {};
    $scope.init = function () {
      new ClipboardJS(".btn-clipboard");
      if (!$rootScope.isBusy) {
        $rootScope.isBusy = true;

        commonService.loadJsonData("micon").then((resp) => {
          ngAppSettings.icons = resp.data.items;
        });
        commonService.loadJsonData("enums").then((resp) => {
          ngAppSettings.enums = resp.data.items;
        });
        apiService.getAllSettings($scope.lang).then(function () {
          if ($rootScope.globalSettings) {
            $scope.portalThemeSettings =
              $rootScope.globalSettings.portalThemeSettings;
            authService.fillAuthData().then(function () {
              $rootScope.authentication = authService.authentication;
              $scope.isAuth = authService.authentication != null;
              $rootScope.isAuth = authService.authentication != null;
              if (authService.authentication) {
                $scope.isAdmin = authService.isInRole("Owner");
              } else {
                window.top.location.href = "/security/login";
              }
            });
            $rootScope.isInit = true;
            $scope.isInit = true;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            window.top.location.href = "/security/login";
          }
        });
      }
    };
  },
]);
