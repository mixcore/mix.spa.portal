"use strict";
appShared.factory("CommonService", [
  "$location",
  "$http",
  "$q",
  "$rootScope",
  "AuthService",
  "localStorageService",
  "AppSettings",
  function (
    $location,
    $http,
    $q,
    $rootScope,
    authService,
    localStorageService,
    appSettings
  ) {
    var factory = {};
    var _settings = {
      lang: "",
      cultures: [],
    };
    var _sendRestRequest = async function (req, isRetry = true) {
      var defer = $q.defer();
      req.uploadEventHandlers = {
        progress: function (e) {
          defer.notify((e.loaded * 100) / e.total);
        },
      };
      return $http(req).then(
        function (resp) {
          if (
            req.url.indexOf("settings") == -1 &&
            (!$rootScope.settings ||
              $rootScope.settings.lastUpdateConfiguration <
                resp.data.lastUpdateConfiguration)
          ) {
            _initAllSettings();
          }

          return { isSucceed: true, data: resp.data };
        },
        function (error) {
          if (error.status === 401 && isRetry) {
            //Try again with new token from previous Request (optional)
            return authService
              .refreshToken(authService.authentication.refresh_token)
              .then(
                function () {
                  req.headers.Authorization =
                    "Bearer " + authService.authentication.access_token;
                  return _sendRestRequest(req, false);
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
        },
        function (progress) {
          console.log("uploading: " + Math.floor(progress) + "%");
        }
      );
    };

    var _sendRequest = async function (
      req,
      onUploadFileProgress = null,
      isRetry = true
    ) {
      if (onUploadFileProgress) {
        req.uploadEventHandlers = {
          progress: function (e) {
            if (e.lengthComputable) {
              progress = Math.round((e.loaded * 100) / e.total);
              onUploadFileProgress(progress);
              console.log("progress: " + progress + "%");
              if (e.loaded == e.total) {
                console.log("File upload finished!");
                console.log("Server will perform extra work now...");
              }
            }
          },
        };
      }
      return $http(req).then(
        function (resp) {
          if (
            req.url.indexOf("settings") == -1 &&
            (!$rootScope.settings ||
              $rootScope.settings.lastUpdateConfiguration <
                resp.data.lastUpdateConfiguration)
          ) {
            _initAllSettings();
          }

          return resp.data;
        },
        function (error) {
          if (error.status === 401 && isRetry) {
            //Try again with new token from previous Request (optional)
            return authService
              .refreshToken(authService.authentication.refresh_token)
              .then(
                function () {
                  req.headers.Authorization =
                    "Bearer " + authService.authentication.access_token;
                  return _sendRequest(req, onUploadFileProgress, false);
                },
                function (err) {
                  var t = { isSucceed: false };

                  authService.logOut();
                  authService.authentication.access_token = null;
                  authService.authentication.refresh_token = null;
                  authService.referredUrl = $location.$$url;
                  window.top.location.href = "/security/login";
                  return t;
                }
              );
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

    var _loadJArrayData = async function (name) {
      var req = {
        method: "GET",
        url: "/portal/jarray-data/" + name,
      };
      return await _getAnonymousApiResult(req);
    };
    var _loadJsonData = async function (name) {
      var req = {
        method: "GET",
        url: "/portal/json-data/" + name,
      };
      return await _getAnonymousApiResult(req);
    };
    var _showAlertMsg = function (title, message) {
      $rootScope.message = {
        title: title,
        value: message,
      };
      $("#modal-msg").modal("show");
    };

    var _checkfile = function (sender, validExts) {
      var fileExt = sender.value;
      fileExt = fileExt.substring(fileExt.lastIndexOf("."));
      if (validExts.indexOf(fileExt) < 0) {
        _showAlertMsg(
          "",
          "Invalid file selected, valid files are of " +
            validExts.toString() +
            " types."
        );
        sender.value = "";
        return false;
      } else return true;
    };

    var _sendMail = async function (subject, body) {
      var url = "/portal/sendmail";
      var req = {
        method: "POST",
        url: url,
        data: { subject: subject, body: body },
      };
      return _getApiResult(req).then(function (response) {
        return response.data;
      });
    };

    var _getSettings = async function (culture) {
      var settings = localStorageService.get("settings");
      // && culture !== undefined && settings.lang === culture
      if (settings) {
        return settings;
      } else {
        var url = "/portal";
        if (culture) {
          url += "/" + culture;
        }
        url += "/settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _getApiResult(req).then(function (response) {
          return response.data;
        });
      }
    };
    var _getAllSettings = async function (culture) {
      var settings = localStorageService.get("settings");
      var globalSettings = localStorageService.get("globalSettings");
      var translator = localStorageService.get("translator");
      if (
        settings &&
        globalSettings &&
        translator &&
        settings.lang === culture
      ) {
        $rootScope.settings = settings;
        $rootScope.globalSettings = globalSettings;
        $rootScope.translator.translator = translator;
      } else {
        var url = "/portal";
        if (culture) {
          url += "/" + culture;
        }
        url += "/all-settings";
        var req = {
          method: "GET",
          url: url,
        };
        return _getApiResult(req).then(function (response) {
          localStorageService.set("settings", response.data.settings);
          localStorageService.set(
            "globalSettings",
            response.data.globalSettings
          );
          localStorageService.set("translator", response.data.translator);
          $rootScope.settings = response.data.settings;
          $rootScope.globalSettings = response.data.globalSettings;
          $rootScope.translator.translator = response.data.translator;
        });
      }
    };

    var _checkConfig = async function (lastSync) {
      if (lastSync) {
        var url = "/portal/check-config/" + lastSync;
        var req = {
          method: "GET",
          url: url,
        };
        return _getApiResult(req).then(function (response) {
          if (response.data) {
            _removeSettings().then(() => {
              _removeTranslator().then(() => {
                localStorageService.set("settings", response.data.settings);
                localStorageService.set(
                  "globalSettings",
                  response.data.globalSettings
                );
                localStorageService.set("translator", response.data.translator);
                $rootScope.settings = response.data.settings;
                $rootScope.globalSettings = response.data.globalSettings;
                $rootScope.translator.translator = response.data.translator;
              });
            });
          } else {
            $rootScope.settings = localStorageService.get("settings");
            $rootScope.globalSettings = localStorageService.get(
              "globalSettings"
            );
            $rootScope.translator.translator = localStorageService.get(
              "translator"
            );
          }
        });
      }
    };

    var _genrateSitemap = async function () {
      var url = "/portal";
      url += "/sitemap";
      var req = {
        method: "GET",
        url: url,
      };
      return _getApiResult(req).then(function (response) {
        return response.data;
      });
    };

    var _setSettings = async function (settings) {
      if (settings && settings.cultures.length > 0) {
        localStorageService.set("settings", settings);
      }
    };

    var _initAllSettings = async function (culture) {
      localStorageService.remove("settings");
      localStorageService.remove("translator");
      localStorageService.remove("globalSettings");

      var response = await _getSettings(culture);
      localStorageService.set("settings", response.settings);
      localStorageService.set("translator", response.translator);
      localStorageService.set("globalSettings", response.globalSettings);

      return response;
    };

    var _removeSettings = async function (settings) {
      localStorageService.remove("settings");
    };

    var _removeTranslator = async function () {
      localStorageService.remove("translator");
    };

    var _fillSettings = async function (culture) {
      var settings = localStorageService.get("settings");
      if (settings && settings.lang === culture) {
        _settings = settings;
        return settings;
      } else {
        if (culture && settings && settings.lang !== culture) {
          await _removeSettings();
          await _removeTranslator();
        }
        settings = await _getSettings(culture);
        localStorageService.set("settings", settings);
        //window.top.location = location.href;
        return settings;
      }
    };
    var _fillAllSettings = async function (culture) {
      var settings = localStorageService.get("settings");
      var globalSettings = localStorageService.get("globalSettings");
      var translator = localStorageService.get("translator");
      if (
        settings &&
        globalSettings &&
        translator &&
        (!culture || settings.lang === culture)
      ) {
        $rootScope.settings = settings;
        $rootScope.globalSettings = globalSettings;
        $rootScope.translator.translator = translator;
        await _checkConfig(globalSettings.lastUpdateConfiguration);
      } else {
        if (culture && settings && settings.lang !== culture) {
          await _removeSettings();
          await _removeTranslator();
        }
        await _getAllSettings(culture);
      }
    };
    var _getApiResult = async function (
      req,
      serviceBase,
      onUploadFileProgress = null
    ) {
      await authService.fillAuthData();
      if (authService.authentication) {
        req.Authorization = authService.authentication.access_token;
      }

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
      return _sendRequest(req, onUploadFileProgress).then(function (resp) {
        return resp;
      });
    };

    var _getRestApiResult = async function (req, serviceBase) {
      if (!authService.authentication) {
        await authService.fillAuthData();
      }
      if (authService.authentication) {
        req.Authorization = authService.authentication.access_token;
      }

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
      return $http(req).then(
        function (resp) {
          if (
            req.url.indexOf("settings") == -1 &&
            (!$rootScope.settings ||
              $rootScope.settings.lastUpdateConfiguration <
                resp.data.lastUpdateConfiguration)
          ) {
            _initAllSettings();
          }

          return { isSucceed: true, data: resp.data };
        },
        function (error) {
          if (error.status === 401) {
            //Try again with new token from previous Request (optional)
            return authService
              .refreshToken(authService.authentication.refresh_token)
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
    factory.sendRestRequest = _sendRestRequest;
    factory.sendRequest = _sendRequest;
    factory.sendMail = _sendMail;
    factory.getApiResult = _getApiResult;
    factory.getRestApiResult = _getRestApiResult;
    factory.getAnonymousApiResult = _getAnonymousApiResult;
    factory.getSettings = _getSettings;
    factory.setSettings = _setSettings;
    factory.initAllSettings = _initAllSettings;
    factory.fillAllSettings = _fillAllSettings;
    factory.removeSettings = _removeSettings;
    factory.removeTranslator = _removeTranslator;
    factory.showAlertMsg = _showAlertMsg;
    factory.checkfile = _checkfile;
    factory.fillSettings = _fillSettings;
    factory.settings = _settings;
    factory.genrateSitemap = _genrateSitemap;
    factory.loadJArrayData = _loadJArrayData;
    factory.loadJsonData = _loadJsonData;
    return factory;
  },
]);
