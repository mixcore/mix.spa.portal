"use strict";
appShared.factory("CommonService", [
  "$rootScope",
  "ApiService",
  "localStorageService",
  function ($rootScope, apiService, localStorageService) {
    var factory = {};

    var _loadJsonData = async function (name) {
      var req = {
        method: "GET",
        url: "/shared/json-data/" + name,
      };
      return await apiService.sendRequest(req, true);
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
      return apiService.sendRequest(req).then(function (response) {
        return response.data;
      });
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
          return apiService.sendRequest(req).then(function (response) {
            if (response.data) {
              _renewSettings();
            } else {
              $rootScope.mixConfigurations =
                localStorageService.get("mixConfigurations");
              $rootScope.appSettings = localStorageService.get("appSettings");
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
          apiService.getAllSettings();
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
      return apiService.sendRequest(req).then(function (response) {
        return response.data;
      });
    };

    var _getPermissions = async function () {
      var req = {
        method: "GET",
        url: "/rest/shared/permissions",
      };
      return await apiService.sendRequest(req);
    };

    var _initAllSettings = async function (culture) {
      localStorageService.remove("mixConfigurations");
      localStorageService.remove("translator");
      localStorageService.remove("appSettings");

      var response = await apiService.getAllSettings();
      if (response) {
        localStorageService.set(
          "mixConfigurations",
          response.mixConfigurations
        );
        localStorageService.set("translator", response.translator);
        localStorageService.set("appSettings", response.appSettings);
      }
      return response;
    };

    var _removeSettings = async function (settings) {
      localStorageService.remove("mixConfigurations");
    };

    var _removeTranslator = async function () {
      localStorageService.remove("translator");
    };

    var _fillAllSettings = async function (culture) {
      var settings = localStorageService.get("mixConfigurations");
      var appSettings = localStorageService.get("appSettings");
      var translator = localStorageService.get("translator");
      if (
        settings &&
        appSettings &&
        translator &&
        (!culture || settings.lang === culture)
      ) {
        $rootScope.mixConfigurations = settings;
        $rootScope.appSettings = appSettings;
        $rootScope.translator.translator = translator;
        await _checkConfig(appSettings.lastUpdateConfiguration);
      } else {
        if (culture && settings && settings.lang !== culture) {
          await _removeSettings();
          await _removeTranslator();
        }
        await apiService.getAllSettings(culture);
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
    factory.loadJsonData = _loadJsonData;
    factory.getPermissions = _getPermissions;
    return factory;
  },
]);
