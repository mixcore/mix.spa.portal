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
        refreshToken: _authentication.refresh_token,
        accessToken: _authentication.access_token,
      };
      if (_authentication) {
        var apiUrl = `/account/refresh-token`;
        var req = {
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(data),
        };
        var resp = await _getApiResult(req);
        if (resp.isSucceed) {
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
          cryptoService.decryptAES(encryptedAuthData.data, encryptedAuthData.k)
        );
      }
      return {};
    };

    var _updateAuthData = async function (encryptedData) {
      localStorageService.set("authorizationData", encryptedData);
    };

    var _getAllSettings = async function (culture) {
      var settings = localStorageService.get("localizeSettings");
      var globalSettings = localStorageService.get("globalSettings");
      var translator = localStorageService.get("translator");
      if (
        settings &&
        globalSettings &&
        translator &&
        settings.lang === culture
      ) {
        $rootScope.localizeSettings = settings;
        $rootScope.globalSettings = globalSettings;
        $rootScope.translator.translator = translator;
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
        return _getRestApiResult(req).then(function (response) {
          response.data.globalSettings.lastUpdateConfiguration = new Date();
          localStorageService.set(
            "localizeSettings",
            response.data.localizeSettings
          );
          localStorageService.set(
            "globalSettings",
            response.data.globalSettings
          );
          localStorageService.set("translator", response.data.translator);
          $rootScope.localizeSettings = response.data.localizeSettings;
          $rootScope.globalSettings = response.data.globalSettings;
          $rootScope.translator.translator = response.data.translator;
        });
      }
    };

    var _initAllSettings = async function (culture) {
      localStorageService.remove("localizeSettings");
      localStorageService.remove("translator");
      localStorageService.remove("globalSettings");

      var response = await _getAllSettings();
      if (response) {
        localStorageService.set("localizeSettings", response.localizeSettings);
        localStorageService.set("translator", response.translator);
        localStorageService.set("globalSettings", response.globalSettings);
      }
      return response;
    };

    var _sendRestRequest = async function (
      req,
      retry = true,
      skipAuthorize = false
    ) {
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
        req.headers.Authorization = `Bearer ${_authentication.access_token}`;
      }

      return $http(req).then(
        function (resp) {
          if (
            req.url.indexOf("settings") == -1 &&
            (!$rootScope.localizeSettings ||
              $rootScope.localizeSettings.lastUpdateConfiguration <
                resp.data.lastUpdateConfiguration)
          ) {
            _initAllSettings();
          }

          return { isSucceed: true, data: resp.data };
        },
        async function (error) {
          if (error.status === 401 && retry) {
            return _refreshToken().then(() =>
              _sendRestRequest(req, false, skipAuthorize)
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
        },
        function (progress) {
          console.log("uploading: " + Math.floor(progress) + "%");
        }
      );
    };

    var _sendRequest = async function (
      req,
      retry = true,
      skipAuthorize = false,
      onUploadFileProgress = null
    ) {
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
        };
      }

      if (!skipAuthorize) {
        var _authentication = await _fillAuthData();
        req.headers.Authorization = `Bearer ${_authentication.access_token}`;
      }
      if (onUploadFileProgress) {
        req.uploadEventHandlers = {
          progress: (e) => _progressHandler(e),
        };
      }
      return $http(req).then(
        function (resp) {
          if (
            req.url.indexOf("localizeSettings") == -1 &&
            (!$rootScope.localizeSettings ||
              $rootScope.localizeSettings.lastUpdateConfiguration <
                resp.data.lastUpdateConfiguration)
          ) {
            _initAllSettings();
          }

          return resp.data;
        },
        async function (error) {
          if (error.status === 401) {
            //Try again with new token from previous Request (optional)
            if (retry) {
              return _refreshToken().then(() =>
                _sendRequest(req, false, skipAuthorize, onUploadFileProgress)
              );
            } else {
              return {
                isSucceed: false,
                errors: [error.statusText || error.status],
              };
            }
          } else if (error.status === 403) {
            var t = { isSucceed: false, errors: ["Forbidden"] };
            $rootScope.showLogin(req, "rest");
            // window.top.location.href = '/security/login';
            return t;
          } else {
            if (error.data) {
              return error.data;
            } else {
              return {
                isSucceed: false,
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

    var _progressHandler = function (e) {
      if (e.lengthComputable) {
        progress = Math.round((e.loaded * 100) / e.total);
        onUploadFileProgress(progress);
        console.log("progress: " + progress + "%");
        if (e.loaded == e.total) {
          console.log("File upload finished!");
          console.log("Server will perform extra work now...");
        }
      }
    };

    var _getApiResult = async function (
      req,
      retry = true,
      skipAuthorize = false,
      serviceBase,
      onUploadFileProgress = null
    ) {
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
      req.headers.Authorization = "Bearer " + req.Authorization || "";
      return _sendRequest(req, retry, skipAuthorize, onUploadFileProgress).then(
        function (resp) {
          return resp;
        }
      );
    };

    var _getRestApiResult = async function (
      req,
      retry = true,
      skipAuthorize = false,
      serviceBase
    ) {
      var serviceUrl =
        appSettings.serviceBase + "/api/" + appSettings.apiVersion;
      if (serviceBase || req.serviceBase) {
        serviceUrl =
          (serviceBase || req.serviceBase) + "/api/" + appSettings.apiVersion;
      }
      req.url = serviceUrl + req.url;
      return _sendRestRequest(req, retry, skipAuthorize);
    };
    var _logOut = async function () {
      localStorageService.remove("authorizationData");
      window.top.location.href = "/security/login";
      //   var apiUrl = "/account/logout";
      //   var req = {
      //     method: "GET",
      //     url: apiUrl,
      //   };
      //   localStorageService.remove("authorizationData");
      //   var resp = await _getRestApiResult(req, false);
      //   if (resp.isSucceed) {
      //     window.top.location.href = "/security/login";
      //   }
    };
    var _getAnonymousApiResult = async function (req) {
      $rootScope.isBusy = true;
      var serviceUrl =
        appSettings.serviceBase + "/api/" + appSettings.apiVersion;
      req.url = serviceUrl + req.url;
      req.headers = {
        "Content-Type": "application/json",
      };
      return $http(req).then(
        function (resp) {
          return resp.data;
        },
        function (error) {
          return {
            isSucceed: false,
            errors: [error.statusText || error.status],
          };
        }
      );
    };
    factory.initAllSettings = _initAllSettings;
    factory.getAllSettings = _getAllSettings;
    factory.refreshToken = _refreshToken;
    factory.fillAuthData = _fillAuthData;
    factory.updateAuthData = _updateAuthData;
    factory.sendRestRequest = _sendRestRequest;
    factory.sendRequest = _sendRequest;
    factory.getApiResult = _getApiResult;
    factory.getRestApiResult = _getRestApiResult;
    factory.getAnonymousApiResult = _getAnonymousApiResult;
    return factory;
  },
]);
