"use strict";
appShared.factory("AuthService", [
  "$http",
  "$rootScope",
  "$routeParams",
  "$q",
  "localStorageService",
  "CryptoService",
  "AppSettings",
  function (
    $http,
    $rootScope,
    $routeParams,
    $q,
    localStorageService,
    cryptoService,
    appSettings
  ) {
    var authServiceFactory = {};
    var _referredUrl = "";
    var _authentication = null;

    var _externalAuthData = {
      provider: "",
      userName: "",
      externalAccessToken: "",
    };

    var _saveRegistration = function (registration) {
      _logOut();

      return $http
        .post("/account/register", registration)
        .then(function (response) {
          return response;
        });
    };
    var _forgotPassword = async function (data) {
      var apiUrl = "/account/forgot-password";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(data),
      };
      var resp = await _getApiResult(req);
      return resp;
    };
    var _resetPassword = async function (data) {
      var apiUrl = "/account/reset-password";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(data),
      };
      var resp = await _getApiResult(req);
      return resp;
    };

    var _login = async function (loginData) {
      var data = {
        UserName: loginData.userName,
        Password: loginData.password,
        RememberMe: loginData.rememberMe,
        Email: "",
        ReturnUrl: "",
      };
      var message = cryptoService.encryptAES(JSON.stringify(data));
      var apiUrl = "/account/login";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify({ message: message }),
      };
      var resp = await _getRestApiResult(req);

      if (resp.isSucceed) {
        let encryptedData = resp.data;
        this.updateAuthData(encryptedData);
        _initSettings().then(function () {
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
        userName: loginData.userName,
        email: loginData.email,
        externalAccessToken: loginData.accessToken,
      };
      var message = cryptoService.encryptAES(JSON.stringify(data));
      var apiUrl = "/account/external-login";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify({ message: message }),
      };
      var resp = await _getRestApiResult(req);

      if (resp.isSucceed) {
        let encryptedData = resp.data;
        this.updateAuthData(encryptedData);
        _initSettings().then(function () {
          return resp;
        });
      } else {
        $rootScope.isBusy = false;
        $rootScope.showErrors(resp.errors);
      }
      return resp;
    };

    var _logOut = async function () {
      var apiUrl = "/account/logout";
      var req = {
        method: "GET",
        url: apiUrl,
      };
      localStorageService.remove("authorizationData");
      _authentication = null;
      var resp = await _getApiResult(req);
      if (resp.isSucceed) {
        window.top.location.href = "/security/login";
      }
    };

    var _fillAuthData = async function () {
      var encryptedAuthData = localStorageService.get("authorizationData");

      if (encryptedAuthData) {
        _authentication = JSON.parse(
          cryptoService.decryptAES(encryptedAuthData.data, encryptedAuthData.k)
        );
        this.authentication = _authentication;
      }
    };

    var _getSettings = async function (culture) {
      var settings = localStorageService.get("localizeSettings");
      // && culture !== undefined && settings.lang === culture
      if (settings) {
        return settings;
      } else {
        var url = "/rest/shared";
        if (culture) {
          url += "/" + culture;
        }
        url += "/get-shared-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _getApiResult(req).then(function (response) {
          return response.data;
        });
      }
    };

    var _updateAuthData = async function (encryptedData) {
      localStorageService.set("authorizationData", encryptedData);
      this.authentication = JSON.parse(
        cryptoService.decryptAES(encryptedData.data, encryptedData.k)
      );
    };

    var _fillSettings = async function (culture) {
      var settings = localStorageService.get("localizeSettings");
      if (settings && settings.lang === culture) {
        _settings = settings;
        return settings;
      } else {
        if (culture !== undefined && settings && settings.lang !== culture) {
          await _removeSettings();
          await _removeTranslator();
        }
        settings = await _getSettings(culture);
        localStorageService.set("localizeSettings", settings);
        //window.top.location = location.href;
        return settings;
      }
    };

    var _initSettings = async function (culture) {
      localStorageService.remove("localizeSettings");
      localStorageService.remove("translator");
      localStorageService.remove("globalSettings");

      var response = await _getSettings(culture);
      localStorageService.set("localizeSettings", response.localizeSettings);
      localStorageService.set("translator", response.translator);
      localStorageService.set("globalSettings", response.globalSettings);

      return response;
    };

    var _refreshToken = async function (id, accessToken) {
      let data = {
        refreshToken: id,
        accessToken: accessToken,
      };
      if (id) {
        var apiUrl = `/account/refresh-token`;
        var req = {
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(data),
        };
        var resp = await _getApiResult(req);
        if (resp.isSucceed) {
          let encryptedData = resp.data;
          return this.updateAuthData(encryptedData);
        } else {
          _logOut();
        }
      } else {
        _logOut();
      }
    };

    var _obtainAccessToken = function (externalData) {
      var deferred = $q.defer();
      var url =
        appSettings.serviceBase +
        "/" +
        appSettings.apiVersion +
        "/account/ObtainLocalAccessToken";
      $http
        .get(url, {
          params: {
            provider: externalData.provider,
            externalAccessToken: externalData.externalAccessToken,
          },
        })
        .success(function (response) {
          localStorageService.set("authorizationData", {
            token: response.access_token,
            userName: response.userName,
            roleName: response.userData.roleNames,
            refresh_token: response.refresh_token,
          });

          _authentication.isAuth = true;
          _authentication.isAdmin = _authentication.isAdmin =
            $.inArray("SuperAdmin", response.userData.RoleNames) >= 0;
          _authentication.userName = response.userName;

          deferred.resolve(response);
        })
        .error(function (err, status) {
          _logOut();
          deferred.reject(err);
        });

      return deferred.promise;
    };

    var _registerExternal = function (registerExternalData) {
      var deferred = $q.defer();

      $http
        .post(
          appSettings.serviceBase +
            "/" +
            appSettings.apiVersion +
            "/account/registerexternal",
          registerExternalData
        )
        .success(function (response) {
          localStorageService.set("authorizationData", {
            token: response.access_token,
            userName: response.userName,
            refresh_token: response.refresh_token,
          });

          _authentication.isAuth = true;
          _authentication.userName = response.userName;

          deferred.resolve(response);
        })
        .error(function (err, status) {
          _logOut();
          deferred.reject(err);
        });

      return deferred.promise;
    };

    var _getApiResult = async function (req) {
      $rootScope.isBusy = true;
      req.url =
        appSettings.serviceBase + "/api/" + appSettings.apiVersion + req.url;

      return $http(req).then(
        function (resp) {
          //var resp = results.data;

          return resp.data;
        },
        function (error) {
          var t = {
            isSucceed: false,
            errors: error.data.errors || [error.statusText],
          };
          return t;
        }
      );
    };

    var _getRestApiResult = async function (req, serviceBase) {
      var serviceUrl =
        appSettings.serviceBase + "/api/" + appSettings.apiVersion;
      if (serviceBase || req.serviceBase) {
        serviceUrl =
          (serviceBase || req.serviceBase) + "/api/" + appSettings.apiVersion;
      }

      req.url = serviceUrl + req.url;
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
        };
      }
      return $http(req).then(
        function (resp) {
          return { isSucceed: true, data: resp.data };
        },
        function (error) {
          if (error.status === 401) {
            //Try again with new token from previous Request (optional)
            return authService
              .refreshToken(
                authService.authentication.refresh_token,
                authService.authentication.access_token
              )
              .then(
                function () {
                  req.headers.Authorization =
                    "Bearer " + authService.authentication.access_token;
                  return $http(req).then(
                    function (results) {
                      return { isSucceed: true, data: results.data };
                    },
                    function (err) {
                      authService.logOut();
                      authService.authentication.access_token = null;
                      authService.authentication.refresh_token = null;
                      authService.referredUrl = $location.$$url;
                      $rootScope.showLogin(req, "rest");
                      // window.top.location.href = '/security/login';
                    }
                  );
                },
                function (err) {
                  var t = { isSucceed: false };

                  authService.logOut();
                  authService.authentication.access_token = null;
                  authService.authentication.refresh_token = null;
                  authService.referredUrl = $location.$$url;
                  $rootScope.showLogin(req, "rest");
                  // window.top.location.href = '/security/login';
                  return t;
                }
              );
          } else if (
            error.status === 200 ||
            error.status === 204 ||
            error.status === 205
          ) {
            return {
              isSucceed: true,
              status: err.status,
              errors: [error.statusText || error.status],
            };
          } else {
            if (error.data) {
              return { isSucceed: false, errors: [error.data] };
            } else {
              return {
                isSucceed: false,
                errors: [error.statusText || error.status],
              };
            }
          }
        }
      );
    };

    var _isInRole = function (roleName) {
      if (!this.authentication) {
        return false;
      }
      var role = this.authentication.info.userRoles.filter(
        (m) => m.description == roleName && m.isActived
      );
      return role.length > 0;
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.isInRole = _isInRole;
    authServiceFactory.forgotPassword = _forgotPassword;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.initSettings = _initSettings;
    authServiceFactory.login = _login;
    authServiceFactory.externalLogin = _externalLogin;
    authServiceFactory.loginPopup = _loginPopup;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.referredUrl = _referredUrl;
    authServiceFactory.updateAuthData = _updateAuthData;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
  },
]);
