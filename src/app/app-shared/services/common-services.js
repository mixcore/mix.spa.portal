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
        url: "/rest/shared/json-data/" + name,
      };
      return await apiService.sendRequest(req, true);
    };

    var _clearCache = async function (name) {
      var req = {
        method: "GET",
        url: "/rest/shared/clear-cache",
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
      var url = "/admin/sendmail";
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
              $rootScope.globalSettings =
                localStorageService.get("appSettings");
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
      var url = "/admin";
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

    var _removeSettings = async function (settings) {
      localStorageService.remove("mixConfigurations");
    };

    var _removeTranslator = async function () {
      localStorageService.remove("translator");
    };

    var _stopApplication = async function () {
      var req = {
        method: "GET",
        url: "/rest/shared/stop-application/",
      };
      return await apiService.sendRequest(req, true);
    };

    factory.sendMail = _sendMail;
    factory.stopApplication = _stopApplication;
    factory.removeSettings = _removeSettings;
    factory.removeTranslator = _removeTranslator;
    factory.showAlertMsg = _showAlertMsg;
    factory.clearCache = _clearCache;
    factory.checkfile = _checkfile;
    factory.genrateSitemap = _genrateSitemap;
    factory.loadJsonData = _loadJsonData;
    factory.getPermissions = _getPermissions;
    return factory;
  },
]);
