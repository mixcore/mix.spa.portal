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
    var _endpoint = "/api/kiotviet";
    var _token = null;
    var _getServerToken = async function () {
      this.token = localStorageService.get("kiotviet_token");
      if (this.token == null || this.token.expired_at < new Date()) {
        var url = `${this.endpoint}/token`;
        var req = {
          method: "GET",
          url: url,
        };
        let result = await _sendRequest(req, true);
        if (result.success) {
          this.token = result.data;
          let now = new Date();
          now.setSeconds(now.getSeconds() + 10);
          this.token.expired_at = now;
          localStorageService.set("kiotviet_token", this.token);
        }
      }
    };

    var _getProducts = async function (queries = null) {
      var url = `${this.endpoint}/products`;
      if (queries) {
        url += "?";
        url = url.concat(_parseQuery(queries));
      }

      var req = {
        method: "GET",
        url: url,
      };
      return await _sendRequest(req, this.token);
    };

    var _getCategories = async function (queries = null) {
      var url = `${this.endpoint}/categories`;
      if (queries) {
        url += "?";
        url = url.concat(_parseQuery(queries));
      }

      var req = {
        method: "GET",
        url: url,
      };
      return _sendRequest(req, this.token);
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

    var _parseQuery = function (req) {
      var result = "";
      if (req) {
        for (var key in req) {
          if (angular.isObject(req.query)) {
            req.query = JSON.stringify(req.query);
          }
          if (req.hasOwnProperty(key) && req[key]) {
            if (result != "") {
              result += "&";
            }
            result += `${key}=${req[key]}`;
          }
        }
        return result;
      } else {
        return result;
      }
    };

    var _sendRequest = async function (req, token = null, retry = true) {
      var defer = $q.defer();
      req.uploadEventHandlers = {
        progress: function (e) {
          defer.notify((e.loaded * 100) / e.total);
        },
      };
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
      }
      if (token) {
        req.headers.Authorization = `Bearer ${token.access_token}`;
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

    factory.getServerToken = _getServerToken;
    factory.getkiotvietSettings = _getkiotvietSettings;
    factory.getProducts = _getProducts;
    factory.getCategories = _getCategories;
    factory.token = _token;
    factory.sendRequest = _sendRequest;
    factory.endpoint = _endpoint;
    return factory;
  },
]);
