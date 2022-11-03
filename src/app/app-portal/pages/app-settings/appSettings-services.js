"use strict";
app.factory("AppSettingsServices", [
  "$http",
  "$rootScope",
  "ApiService",
  "CommonService",
  function ($http, $rootScope, apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var appSettingssServiceFactory = {};

    var settings = $rootScope.globalSettings;

    var _getAppSettings = async function (name) {
      var url = `/rest/settings/${name}`;

      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _saveAppSettings = async function (name, appSettings) {
      var url = `/rest/settings/${name}`;
      var req = {
        method: "POST",
        url: url,
        data: appSettings,
      };
      return await apiService.sendRequest(req);
    };
    // var _saveAppSettings = async function (name, content) {
    //   var apiUrl = "/admin/app-settings/save-global/" + name;
    //   var req = {
    //     method: "POST",
    //     url: apiUrl,
    //     data: JSON.stringify(content),
    //   };
    //   return await apiService.sendRequest(req);
    // };

    appSettingssServiceFactory.getAppSettings = _getAppSettings;
    appSettingssServiceFactory.saveAppSettings = _saveAppSettings;
    return appSettingssServiceFactory;
  },
]);
