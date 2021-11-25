"use strict";
appShared.factory("ApiService", [
  "$location",
  "$http",
  "$q",
  "$rootScope",
  "localStorageService",
  "CryptoService",
  "AppSettings",
  function (
    $location,
    $http,
    $q,
    $rootScope,
    localStorageService,
    cryptoService,
    appSettings
  ) {
    var factory = {};

    var _refreshToken = async function () {
      let _authentication = await _fillAuthData();
      let data = {
        refreshToken: _authentication.refreshToken,
        accessToken: _authentication.accessToken,
      };
      if (_authentication) {
        var apiUrl = `/rest/mix-account/renew-token`;
        var req = {
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(data),
        };
        var resp = await _sendRequest(req);
        if (resp.success) {
          let encryptedData = resp.data;
          return _updateAuthData(encryptedData);
        } else {
          _logOut();
        }
      } else {
        _logOut();
      }
    };

    var _fillAuthData = async function () {
      var encryptedAuthData = localStorageService.get("authorizationData");

      if (encryptedAuthData) {
        return JSON.parse(
          cryptoService.decryptAES(
            encryptedAuthData.message,
            encryptedAuthData.aesKey
          )
        );
      }
      return {};
    };

    var _updateAuthData = async function (encryptedData) {
      localStorageService.set("authorizationData", encryptedData);
    };

    var _getAllSettings = async function (culture) {
      $rootScope.globalSettings = localStorageService.get("appSettings");
      $rootScope.translator = localStorageService.get("translator");
      $rootScope.mixConfigurations =
        localStorageService.get("mixConfigurations");
      if (!$rootScope.globalSettings) {
        var url = "/rest/shared";
        if (culture) {
          url += "/" + culture;
        }
        url += "/get-shared-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _sendRequest(req, true).then(function (response) {
          if (response.success) {
            response.data.globalSettings.lastUpdateConfiguration = new Date();
            localStorageService.set(
              "appSettings",
              response.data.globalSettings
            );
            localStorageService.set("translator", response.data.translator);
            localStorageService.set(
              "mixConfigurations",
              response.data.mixConfigurations
            );
            $rootScope.globalSettings = response.data.appSettings;
            $rootScope.mixConfigurations = response.data.mixConfigurations;
            $rootScope.translator = response.data.translator;
          } else {
            $rootScope.showErrors(response.errors);
          }
        });
      }
    };

    var _getTranslator = async function (culture) {
      $rootScope.translator = localStorageService.get("translator");
      if (!$rootScope.translator) {
        var url = `/rest/shared/mix-common/mix-languague-content?lang=${culture}`;
        var req = {
          method: "GET",
          url: url,
        };
        return _sendRequest(req, true).then(function (response) {
          if (response.success) {
            localStorageService.set("translator", response.data.translator);
            $rootScope.translator = response.data.translator;
          } else {
            $rootScope.showErrors(response.errors);
          }
        });
      }
    };

    var _initAllSettings = async function (culture) {
      localStorageService.remove("appSettings");

      var response = await _getAllSettings();
      if (response) {
        localStorageService.set(
          "mixConfigurations",
          response.mixConfigurations
        );
        localStorageService.set("appSettings", response.appSettings);
      }
      return response;
    };

    var _sendRequest = async function (
      req,
      skipAuthorize = false,
      retry = true
    ) {
      let apiVersion = req.apiVersion || appSettings.apiVersion;
      let serviceBase = req.serviceBase || appSettings.serviceBase;
      var serviceUrl = `${serviceBase}/api/${apiVersion}`;
      if (req.url.indexOf(serviceUrl) < 0) {
        req.url = serviceUrl + req.url;
      }
      var defer = $q.defer();
      req.uploadEventHandlers = {
        progress: function (e) {
          defer.notify((e.loaded * 100) / e.total);
        },
      };
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
        };
      }

      if (!skipAuthorize) {
        let _authentication = await _fillAuthData();
        req.headers.Authorization = `Bearer ${_authentication.accessToken}`;
      }

      return $http(req).then(
        function (resp) {
          return { success: true, data: resp.data };
        },
        async function (error) {
          if (error.status === 401 && retry) {
            return _refreshToken().then(() =>
              _sendRequest(req, false, skipAuthorize)
            );
          } else if (
            error.status === 200 ||
            error.status === 201 ||
            error.status === 204 ||
            error.status === 205
          ) {
            return {
              success: true,
              status: err.status,
              errors: [error.statusText || error.status],
            };
          } else {
            if (error.data) {
              return { success: false, errors: [error.data] };
            } else {
              return {
                success: false,
                errors: [error.statusText || error.status],
              };
            }
          }
        },
        function (progress) {
          console.log("uploading: " + Math.floor(progress) + "%");
        }
      );
    };

    var _logOut = async function () {
      localStorageService.remove("authorizationData");
      window.top.location.href = "/security/login";
      //   var apiUrl = "/rest/mix-account/logout";
      //   var req = {
      //     method: "GET",
      //     url: apiUrl,
      //   };
      //   localStorageService.remove("authorizationData");
      //   var resp = await _getRestApiResult(req, false);
      //   if (resp.success) {
      //     window.top.location.href = "/security/login";
      //   }
    };

    factory.initAllSettings = _initAllSettings;
    factory.getAllSettings = _getAllSettings;
    factory.getTranslator = _getTranslator;
    factory.refreshToken = _refreshToken;
    factory.fillAuthData = _fillAuthData;
    factory.updateAuthData = _updateAuthData;
    factory.sendRequest = _sendRequest;
    return factory;
  },
]);
