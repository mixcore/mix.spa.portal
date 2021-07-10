﻿"use strict";
app.controller("loginController", [
  "$rootScope",
  "$scope",
  "ngAppSettings",
  "$location",
  "AuthService",
  "ngAppSettings",
  function (
    $rootScope,
    $scope,
    ngAppSettings,
    $location,
    authService,
    ngAuthSettings
  ) {
    if (
      authService.authentication &&
      authService.authentication.isAuth &&
      authService.authentication.isAdmin
    ) {
      authService.referredUrl = $location.path();
      $location.path("/portal");
    }

    $scope.pageClass = "page-login";

    $scope.loginData = {
      username: "",
      password: "",
      rememberme: true,
    };

    $scope.message = "";
    $scope.$on("$viewContentLoaded", function () {
      $rootScope.isBusy = false;
    });
    $scope.login = async function () {
      if (authService.referredUrl === "/init/login") {
        authService.referredUrl = "/portal";
      }
      $rootScope.isBusy = true;
      var result = await authService.login($scope.loginData);
      if (result.success) {
        if ($routeParams.ReturnUrl) {
          window.top.location = $routeParams.ReturnUrl;
        } else if (
          document.referrer &&
          document.referrer.indexOf("init") === -1
        ) {
          window.top.location = document.referrer;
        } else {
          window.top.location = "/";
        }
      }
      $rootScope.isBusy = false;
      $scope.$apply();
    };

    $scope.authExternalProvider = function (provider) {
      var redirectUri =
        location.protocol + "//" + location.host + "/authcomplete.html";

      var externalProviderUrl =
        ngAuthSettings.apiServiceBaseUri +
        "api/Account/ExternalLogin?provider=" +
        provider +
        "&response_type=token&client_id=" +
        ngAuthSettings.clientId +
        "&redirect_uri=" +
        redirectUri;
      window.$windowScope = $scope;

      var oauthWindow = window.open(
        externalProviderUrl,
        "Authenticate Account",
        "location=0,status=0,width=600,height=750"
      );
    };

    $scope.authCompletedCB = function (fragment) {
      $scope.$apply(function () {
        if (fragment.haslocalaccount === "False") {
          authService.logOut();

          authService.externalAuthData = {
            provider: fragment.provider,
            userName: fragment.external_user_name,
            externalAccessToken: fragment.external_access_token,
          };

          $location.path("/associate");
        } else {
          //Obtain access token and redirect to orders
          var externalData = {
            provider: fragment.provider,
            externalAccessToken: fragment.external_access_token,
          };
          authService.obtainAccessToken(externalData).then(
            function (response) {
              $location.path("/orders");
            },
            function (err) {
              $scope.message = err.error_description;
            }
          );
        }
      });
    };
  },
]);
