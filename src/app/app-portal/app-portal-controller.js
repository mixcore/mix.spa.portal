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
          if ($rootScope.appSettings) {
            $scope.portalThemeSettings =
              $rootScope.appSettings.portalThemeSettings;
            authService.fillAuthData().then(function () {
              $rootScope.authentication = authService.authentication;
              $scope.isAuth = authService.authentication != null;
              $rootScope.isAuth = authService.authentication != null;
              if (authService.authentication) {
                $scope.isAdmin = authService.isInRole("SuperAdmin");
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
    $rootScope.getRequest = function (key) {
      key =
        key || `request${$rootScope.generateKeyword($location.$$path, "_")}`;
      let lstRequest = localStorageService.get("requests") ?? {};
      let request = lstRequest[key];
      if (!request) {
        request = angular.copy(ngAppSettings.request);
        lstRequest[key] = request;
        localStorageService.set("requests", lstRequest);
      }
      return request;
    };
    $rootScope.setRequest = function (req, key) {
      key =
        key || `request${$rootScope.generateKeyword($location.$$path, "_")}`;
      let lstRequest = localStorageService.get("requests") ?? {};
      if (req) {
        lstRequest[key] = req;
        localStorageService.set("requests", lstRequest);
      }
    };
  },
]);
