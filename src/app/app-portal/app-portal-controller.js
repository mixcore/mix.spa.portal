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
  "GlobalSettingsService",
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
    globalSettingsService,
    localStorageService
  ) {
    $scope.isInit = false;
    $scope.pageTagName = "";
    $scope.pageTagTypeName = "";
    $scope.pageTagType = 0;
    $scope.isAdmin = false;
    $scope.translator = translatorService;
    $rootScope.globalSettingsService = globalSettingsService;
    $scope.lang = null;
    $scope.localizeSettings = {};
    $scope.portalThemeSettings = {};
    $scope.init = function () {
      new ClipboardJS(".btn-clipboard");

      if (!$rootScope.isBusy) {
        $rootScope.isBusy = true;

        commonService.loadJArrayData("micon.json").then((resp) => {
          ngAppSettings.icons = resp.data;
        });
        commonService.loadJsonData("enums.json").then((resp) => {
          ngAppSettings.enums = resp.data;
        });
        commonService.fillAllSettings($scope.lang).then(function (response) {
          ngAppSettings.localizeSettings = $rootScope.localizeSettings.data;
          if ($rootScope.globalSettings) {
            $scope.portalThemeSettings =
              $rootScope.globalSettings.portalThemeSettings;
            authService.fillAuthData().then(function (response) {
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
    $scope.initFB = function () {
      window.fbAsyncInit = function () {
        FB.init({
          appId: "1958592154434745",
          cookie: true,
          xfbml: true,
          version: "v10.0",
        });

        FB.AppEvents.logPageView();
      };
    };
    $scope.$on("$routeChangeStart", function ($event, next, current) {
      // ... you could trigger something here ...
      if (current && current.$$route) {
        $rootScope.referrerUrl = current.$$route.originalPath;
        Object.keys(current.params).forEach(function (key, index) {
          // key: the name of the object key
          // index: the ordinal position of the key within the object
          if ($rootScope.referrerUrl.indexOf(":" + key) >= 0) {
            $rootScope.referrerUrl = $rootScope.referrerUrl.replace(
              ":" + key,
              current.params[key]
            );
          } else {
            if ($rootScope.referrerUrl.indexOf("?") < 0) {
              $rootScope.referrerUrl += "?";
            }
            $rootScope.referrerUrl += key + "=" + current.params[key] + "&";
          }
        });
      }
      $scope.pageTagName = $location.$$path.toString().split("/")[2];
      $scope.pageTagTypeName = $location.$$path.toString().split("/")[3];
      if ($scope.pageTagTypeName == "list") $scope.pageTagType = 1;
      if ($scope.pageTagTypeName == "create") $scope.pageTagType = 2;
    });
    $rootScope.limString = function (str, max) {
      return str.substring(0, max);
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
