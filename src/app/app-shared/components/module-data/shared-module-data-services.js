"use strict";
appShared.factory("SharedModuleDataService", [
  "$http",
  "$rootScope",
  "ApiService",
  "CommonService",
  function ($http, $rootScope, apiService, commonService) {
    var moduleDatasServiceFactory = {};

    var _updateInfos = async function (pages) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data";
      var req = {
        method: "POST",
        url: apiUrl + "/update-infos",
        data: JSON.stringify(pages),
      };
      return await apiService.getApiResult(req);
    };

    var _getModuleData = async function (moduleId, id, type) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var url = apiUrl + "details/" + type;
      if (id) {
        url += "/" + moduleId + "/" + id;
      } else {
        url += "/" + moduleId;
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };

    var _getModuleDatas = async function (request) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var req = {
        method: "POST",
        url: apiUrl + "list",
        data: JSON.stringify(request),
      };

      return await apiService.getApiResult(req);
    };

    var _exportModuleData = async function (request) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var req = {
        method: "POST",
        url: apiUrl + "export",
        data: JSON.stringify(request),
      };

      return await apiService.getApiResult(req);
    };

    var _initModuleForm = async function (name) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var req = {
        method: "GET",
        url: apiUrl + "init-by-name/" + name,
      };

      return await apiService.getApiResult(req);
    };

    var _removeModuleData = async function (id) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var req = {
        method: "GET",
        url: apiUrl + "delete/" + id,
      };
      return await apiService.getApiResult(req);
    };

    var _saveModuleData = async function (moduleData) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var req = {
        method: "POST",
        url: apiUrl + "save",
        data: JSON.stringify(moduleData),
      };
      return await apiService.getApiResult(req);
    };
    var _saveFields = async function (id, propertyName, propertyValue) {
      var apiUrl = "/" + $rootScope.localizeSettings.lang + "/module-data/";
      var column = [
        {
          propertyName: propertyName,
          propertyValue: propertyValue,
        },
      ];
      var req = {
        method: "POST",
        url: apiUrl + "save/" + id,
        data: JSON.stringify(column),
      };
      return await apiService.getApiResult(req);
    };
    moduleDatasServiceFactory.getModuleData = _getModuleData;
    moduleDatasServiceFactory.getModuleDatas = _getModuleDatas;
    moduleDatasServiceFactory.exportModuleData = _exportModuleData;
    moduleDatasServiceFactory.removeModuleData = _removeModuleData;
    moduleDatasServiceFactory.saveModuleData = _saveModuleData;
    moduleDatasServiceFactory.initModuleForm = _initModuleForm;
    moduleDatasServiceFactory.saveFields = _saveFields;
    moduleDatasServiceFactory.updateInfos = _updateInfos;
    return moduleDatasServiceFactory;
  },
]);
