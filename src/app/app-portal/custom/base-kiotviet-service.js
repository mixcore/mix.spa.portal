"use strict";
app.factory("BaseKiotvietService", [
  "$http",
  "$q",
  "CryptoService",
  function ($http, $q, cryptoService) {
    var factory = {};
    var _endpoint = null;
    var _token = null;
    var _modelName = null;
    var _init = function (modelName) {
      this._modelName = modelName;
      this._endpoint = `/api/kiotviet/${modelName}`;
    };

    var _getList = async function (queries = null) {
      var url = this._endpoint;
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

    var _getSingle = async function (id) {
      var url = `${this._endpoint}/${id}`;
      var req = {
        method: "GET",
        url: url,
      };
      return _sendRequest(req, this.token);
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

    factory.init = _init;
    factory.getList = _getList;
    factory.getSingle = _getSingle;
    return factory;
  },
]);
