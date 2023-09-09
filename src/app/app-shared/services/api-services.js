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
        var apiUrl = `/rest/mix-account/user/renew-token`;
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
      await _getAllSettings();
      var encryptedAuthData = localStorageService.get("authorizationData");
      if (encryptedAuthData) {
        if ($rootScope.globalSettings.isEncryptApi) {
          return JSON.parse(
            cryptoService.decryptAES(
              encryptedAuthData.message,
              $rootScope.globalSettings.apiEncryptKey
            )
          );
        }
        return encryptedAuthData;
      }
      return {};
    };

    var _getPortalMenus = async function () {
      var req = {
        method: "GET",
        url: "/rest/mix-portal/common/portal-menus",
      };
      return _sendRequest(req);
    };

    var _updateAuthData = async function (encryptedData) {
      localStorageService.set("authorizationData", encryptedData);
    };

    var _getAllSettings = async function (culture) {
      $rootScope.globalSettings = localStorageService.get("globalSettings");
      $rootScope.translator = localStorageService.get("translator");
      $rootScope.mixConfigurations =
        localStorageService.get("mixConfigurations");
      if (
        !$rootScope.globalSettings ||
        new Date($rootScope.globalSettings.expiredAt) < new Date()
      ) {
        var url = "/rest/shared";
        if (culture) {
          url += "/" + culture;
        }
        url += "/get-all-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _sendRequest(req, true).then(function (response) {
          if (response.success) {
            response.data.globalSettings.lastUpdateConfiguration = new Date();
            localStorageService.set(
              "globalSettings",
              response.data.globalSettings
            );
            localStorageService.set("translator", response.data.translator);
            localStorageService.set(
              "mixConfigurations",
              response.data.mixConfigurations
            );
            $rootScope.globalSettings = response.data.globalSettings;
            $rootScope.mixConfigurations = response.data.mixConfigurations;
            $rootScope.translator = response.data.translator;
          } else {
            $rootScope.showErrors(response.errors);
          }
        });
      }
    };
    var _getGlobalSettings = async function () {
      $rootScope.globalSettings = localStorageService.get("globalSettings");
      if (
        !$rootScope.globalSettings ||
        new Date($rootScope.globalSettings.expiredAt) < new Date()
      ) {
        var url = "/rest/shared/get-global-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _sendRequest(req, true).then(function (response) {
          if (response.success) {
            response.data.lastUpdateConfiguration = new Date();
            localStorageService.set("globalSettings", response.data);
            $rootScope.globalSettings = response.data.globalSettings;
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
      token = null,
      retry = true
    ) {
      let apiVersion =
        req.apiVersion == undefined ? appSettings.apiVersion : req.apiVersion;
      let serviceBase =
        req.serviceBase == undefined
          ? appSettings.serviceBase
          : req.serviceBase;
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

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }

      return $http(req).then(
        function (resp) {
          return { success: true, data: resp.data };
        },
        async function (error) {
          if (error.status === 401 && retry) {
            return _refreshToken().then(() =>
              _sendRequest(req, skipAuthorize, null, false)
            );
          } else if (error.status === 401) {
            window.location.href = "/security/login";
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
    var _sendPureRequest = async function (req) {
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
        };
      }
      return $http(req).then(
        function (resp) {
          return { success: true, data: resp.data };
        },
        async function (error) {
          if (
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
    var _ajaxSubmitForm = async function (form, url) {
      var req = {
        method: "POST",
        url: url,
        headers: { "Content-Type": undefined },
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: form,
      };
      return await _sendRequest(req);
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
    factory.getGlobalSettings = _getGlobalSettings;
    factory.getTranslator = _getTranslator;
    factory.refreshToken = _refreshToken;
    factory.fillAuthData = _fillAuthData;
    factory.getPortalMenus = _getPortalMenus;
    factory.updateAuthData = _updateAuthData;
    factory.sendRequest = _sendRequest;
    factory.sendPureRequest = _sendPureRequest;
    factory.ajaxSubmitForm = _ajaxSubmitForm;
    return factory;
  },
]);
