"use strict";
app.controller("LoginController", [
  "$rootScope",
  "$scope",
  "$location",
  "$routeParams",
  "ApiService",
  "CommonService",
  "AuthService",
  function (
    $rootScope,
    $scope,
    $location,
    $routeParams,
    apiService,
    commonService,
    authService
  ) {
    $scope.canLogin = true;
    if (authService.authentication && authService.isInRole("SuperAdmin")) {
      authService.referredUrl = $location.path();
      $location.path("/portal");
    }

    $scope.pageClass = "page-login";

    $scope.loginData = {
      username: "",
      password: "",
      rememberMe: true,
    };

    $scope.message = "";
    $scope.$on("$viewContentLoaded", async function () {
      $rootScope.isBusy = false;
      await commonService.fillAllSettings();
    });
    $scope.login = async function () {
      $rootScope.isBusy = true;
      var result = await authService.login($scope.loginData);
      if (result.isSucceed) {
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
    $scope.externalLogin = async function (loginData, provider) {
      var result = await authService.externalLogin(loginData, provider);
      if (result) {
        $scope.canLogin = false;
        let returnUrl = $scope.getReturnUrl();
        let hasPermission = $scope.hasPermission(returnUrl);
        if (hasPermission) {
          window.top.location = returnUrl;
        } else {
          $rootScope.showErrors([
            "You don't have permission to access this url",
          ]);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
    $scope.logOut = function () {
      $scope.canLogin = true;
      $scope.$apply();
    };

    $scope.getReturnUrl = function () {
      return $routeParams.ReturnUrl
        ? $routeParams.ReturnUrl
        : document.referrer && document.referrer.indexOf("init") === -1
        ? document.referrer
        : "/";
    };

    $scope.hasPermission = function (url) {
      return (
        url == "/" ||
        authService.isInRole("SuperAdmin") ||
        (authService.authentication.permissions &&
          authService.authentication.permissions.contains(url))
      );
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
            username: fragment.external_user_name,
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
