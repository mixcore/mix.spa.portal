"use strict";
app.factory("Step1Services", [
  "$http",
  "$rootScope",
  "AppSettings",
  "ApiService",
  "CommonService",
  function ($http, $rootScope, appSettings, apiService, commonService) {
    var step1ServiceFactory = {};
    var _saveDefaultSettings = async function () {
      var req = {
        method: "GET",
        url: "/portal/app-settings/save-default",
      };
      return apiService.getAnonymousApiResult(req);
    };

    var _initCms = async function (data) {
      var req = {
        method: "POST",
        url: "/init/init-cms/step-1",
        data: JSON.stringify(data),
      };
      return await apiService.getAnonymousApiResult(req);
    };

    step1ServiceFactory.initCms = _initCms;
    step1ServiceFactory.saveDefaultSettings = _saveDefaultSettings;
    return step1ServiceFactory;
  },
]);
