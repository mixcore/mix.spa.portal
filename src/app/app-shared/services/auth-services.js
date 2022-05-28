"use strict";
appShared.factory("AuthService", [
  "$http",
  "$rootScope",
  "$routeParams",
  "$q",
  "localStorageService",
  "CryptoService",
  "ApiService",
  function (
    $http,
    $rootScope,
    $routeParams,
    $q,
    localStorageService,
    cryptoService,
    apiService
  ) {
    var authServiceFactory = {};
    var _authentication = null;

    var _saveRegistration = function (registration) {
      _logOut();

      return $http
        .post("/rest/mix-account/user/register", registration)
        .then(function (response) {
          return response;
        });
    };

    var _forgotPassword = async function (data) {
      var apiUrl = "/rest/mix-account/user/forgot-password";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(data),
      };
      var resp = await apiService.sendRequest(req);
      return resp;
    };

    var _resetPassword = async function (data) {
      var apiUrl = "/rest/mix-account/user/reset-password";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(data),
      };
      var resp = await apiService.sendRequest(req);
      return resp;
    };

    var _getExternalLoginProviders = async function (data) {
      var apiUrl = "/rest/mix-account/user/get-external-login-providers";
      var req = {
        method: "GET",
        url: apiUrl,
      };
      var resp = await apiService.sendRequest(req);
      return resp;
    };

    var _login = async function (loginData) {
      var data = {
        UserName: loginData.username,
        Password: loginData.password,
        RememberMe: loginData.rememberMe,
        Email: "",
        ReturnUrl: "",
      };
      var message = cryptoService.encryptAES(JSON.stringify(data));
      var apiUrl = "/rest/mix-account/user/login";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify({ message: message }),
      };
      var resp = await apiService.sendRequest(req, true);
      if (resp.success) {
        let encryptedData = resp.data;
        apiService.updateAuthData(encryptedData);
        apiService.getAllSettings().then(function () {
          if ($routeParams.ReturnUrl) {
            setTimeout(() => {
              window.top.location = $routeParams.ReturnUrl;
            }, 200);
          } else if (
            document.referrer &&
            document.referrer.indexOf("init") === -1
          ) {
            setTimeout(() => {
              window.top.location = document.referrer;
            }, 200);
          } else {
            setTimeout(() => {
              window.top.location = "/";
            }, 200);
          }
        });
      } else {
        $rootScope.isBusy = false;
        $rootScope.showErrors(resp.errors);
      }
      return resp;
    };

    var _loginPopup = async function (loginData) {
      return await this.login(loginData);
    };

    var _externalLogin = async function (loginData, provider) {
      var data = {
        provider: provider,
        username: loginData.username,
        email: loginData.email,
        externalAccessToken: loginData.accessToken,
      };
      var message = cryptoService.encryptAES(JSON.stringify(data));
      var apiUrl = "/rest/mix-account/user/external-login";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify({ message: message }),
      };
      var resp = await apiService.sendRequest(req, true);

      if (resp.success) {
        let encryptedData = resp.data;
        apiService.updateAuthData(encryptedData);
        apiService.initAllSettings().then(function () {
          return resp;
        });
      } else {
        $rootScope.isBusy = false;
        $rootScope.showErrors(resp.errors);
      }
      return resp;
    };

    var _logOut = async function () {
      localStorageService.remove("authorizationData");
      window.top.location.href = "/security/login";

      //     var apiUrl = "/rest/mix-account/logout";
      //   var req = {
      //     method: "GET",
      //     url: apiUrl,
      //   };

      //   _authentication = null;
      //   var resp = await apiService.sendRequest(req);
      //   if (resp.success) {
      //     window.top.location.href = "/security/login";
      //   }
    };

    var _fillAuthData = async function () {
      this.authentication = await apiService.fillAuthData();
      return this.authentication;
    };

    var _refreshToken = async function () {
      await apiService.refreshToken();
      this.authentication = await apiService.fillAuthData();
      return this.authentication;
    };

    var _isInRole = function (roleName) {
      if (!this.authentication || !this.authentication.info) {
        return false;
      }
      var role = this.authentication.info.roles.filter(
        (m) => m.description == roleName && m.isActived
      );
      return role.length > 0;
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.isInRole = _isInRole;
    authServiceFactory.forgotPassword = _forgotPassword;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.login = _login;
    authServiceFactory.externalLogin = _externalLogin;
    authServiceFactory.loginPopup = _loginPopup;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.getExternalLoginProviders = _getExternalLoginProviders;
    return authServiceFactory;
  },
]);
