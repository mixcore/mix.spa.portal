"use strict";
app.factory("KiotvietService", [
  "$http",
  "$q",
  "$rootScope",
  "localStorageService",
  "CryptoService",
  "AppSettings",
  function (
    $http,
    $q,
    $rootScope,
    localStorageService,
    cryptoService,
    appSettings
  ) {
    var factory = {};

    var _getToken = async function () {
      debugger;
      var url = `${$rootScope.kiotvietSettings.Endpoint}/connect/token`;
      let data = {
        scopes: "PublicApi.Access",
        grant_type: "client_credentials",
        client_id: $rootScope.kiotvietSettings.AppId,
        client_secret: $rootScope.kiotvietSettings.AppSecret,
      };
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(data),
      };
      let result = await _sendRequest(req, true);
      console.log(result);
    };

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
      var encryptedAuthData = localStorageService.get(
        "kiotvietAuthorizationData"
      );

      if (encryptedAuthData) {
        return JSON.parse(
          cryptoService.decryptAES(
            encryptedAuthData.message,
            $rootScope.globalSettings.apiEncryptKey
          )
        );
      }
      return {};
    };

    var _updateAuthData = async function (encryptedData) {
      localStorageService.set("authorizationData", encryptedData);
    };

    var _getkiotvietSettings = async function () {
      let settings = localStorageService.get("kiotvietSettings");
      if (settings) {
        $rootScope.kiotvietSettings = JSON.parse(
          cryptoService.decryptAES(
            settings,
            $rootScope.globalSettings.apiEncryptKey
          )
        );
      } else {
        var url = "/api/kiotviet/get-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _sendRequest(req, true).then(function (response) {
          if (response.success) {
            localStorageService.set("kiotvietSettings", response.data);
            $rootScope.kiotvietSettings = JSON.parse(
              cryptoService.decryptAES(
                response.data,
                $rootScope.globalSettings.apiEncryptKey
              )
            );
          } else {
            $rootScope.showErrors(response.errors);
          }
        });
      }
    };

    var _sendRequest = async function (
      req,
      skipAuthorize = false,
      retry = true
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

    factory.getToken = _getToken;
    factory.getkiotvietSettings = _getkiotvietSettings;
    factory.refreshToken = _refreshToken;
    factory.fillAuthData = _fillAuthData;
    factory.updateAuthData = _updateAuthData;
    factory.sendRequest = _sendRequest;
    return factory;
  },
]);
