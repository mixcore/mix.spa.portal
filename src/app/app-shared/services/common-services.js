"use strict";
appShared.factory("CommonService", [
  "$rootScope",
  "ApiService",
  "localStorageService",
  function ($rootScope, apiService, localStorageService) {
    var factory = {};

    var _loadJArrayData = async function (name) {
      var req = {
        method: "GET",
        url: "/portal/jarray-data/" + name,
      };
      return await apiService.getAnonymousApiResult(req);
    };

    var _stopApplication = async function () {
      var req = {
        method: "GET",
        url: "/rest/shared/stop-application",
      };
      return await apiService.getRestApiResult(req, false, true);
    };

    var _clearCache = async function () {
      var req = {
        method: "GET",
        url: "/rest/shared/clear-cache",
      };
      return await apiService.getRestApiResult(req, false, true);
    };

    var _loadJsonData = async function (name) {
      var req = {
        method: "GET",
        url: "/portal/json-data/" + name,
      };
      return await apiService.getAnonymousApiResult(req);
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
      return apiService.getApiResult(req).then(function (response) {
        return response.data;
      });
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
        return apiService
          .getRestApiResult(req, false, true)
          .then(function (response) {
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

    var _checkConfig = async function (lastSync) {
      if (!lastSync) {
        _renewSettings();
      } else {
        var d = new Date(lastSync);
        d.setMinutes(d.getMinutes() + 20);
        let now = new Date();
        if (now > d) {
          _renewSettings();
        } else {
          var url = "/rest/shared/check-config/" + lastSync;
          var req = {
            method: "GET",
            url: url,
          };
          return apiService
            .getApiResult(req, true, true)
            .then(function (response) {
              if (response.data) {
                _renewSettings();
              } else {
                $rootScope.localizeSettings =
                  localStorageService.get("localizeSettings");
                $rootScope.globalSettings =
                  localStorageService.get("globalSettings");
                $rootScope.translator.translator =
                  localStorageService.get("translator");
              }
            });
        }
      }
    };

    var _renewSettings = function () {
      _removeSettings().then(() => {
        _removeTranslator().then(() => {
          _getAllSettings();
        });
      });
    };

    var _genrateSitemap = async function () {
      var url = "/portal";
      url += "/sitemap";
      var req = {
        method: "GET",
        url: url,
      };
      return apiService.getApiResult(req).then(function (response) {
        return response.data;
      });
    };

    var _getPermissions = async function () {
      var req = {
        method: "GET",
        url: "/rest/shared/permissions",
      };
      return await apiService.getRestApiResult(req);
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

    var _removeSettings = async function (settings) {
      localStorageService.remove("localizeSettings");
    };

    var _removeTranslator = async function () {
      localStorageService.remove("translator");
    };

    var _fillAllSettings = async function (culture) {
      var settings = localStorageService.get("localizeSettings");
      var globalSettings = localStorageService.get("globalSettings");
      var translator = localStorageService.get("translator");
      if (
        settings &&
        globalSettings &&
        translator &&
        (!culture || settings.lang === culture)
      ) {
        $rootScope.localizeSettings = settings;
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

    factory.sendMail = _sendMail;
    factory.initAllSettings = _initAllSettings;
    factory.fillAllSettings = _fillAllSettings;
    factory.removeSettings = _removeSettings;
    factory.removeTranslator = _removeTranslator;
    factory.showAlertMsg = _showAlertMsg;
    factory.checkfile = _checkfile;
    factory.genrateSitemap = _genrateSitemap;
    factory.loadJArrayData = _loadJArrayData;
    factory.stopApplication = _stopApplication;
    factory.loadJsonData = _loadJsonData;
    factory.clearCache = _clearCache;
    factory.getPermissions = _getPermissions;
    return factory;
  },
]);
