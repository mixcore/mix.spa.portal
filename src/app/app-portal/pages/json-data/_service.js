﻿"use strict";
app.factory("JsonDataService", [
  "$http",
  "$rootScope",
  "ApiService",
  "CommonService",
  function ($http, $rootScope, apiService, commonService) {
    var filesServiceFactory = {};

    var settings = $rootScope.appSettings;

    var _getFile = async function (folder, filename) {
      var apiUrl = "/file/";
      var url = apiUrl + "details?folder=" + folder + "&filename=" + filename;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _initFile = async function (type) {
      var apiUrl = "/file/";
      var req = {
        method: "GET",
        url: apiUrl + "init/" + type,
      };
      return await apiService.sendRequest(req);
    };

    var _getFiles = async function (request) {
      var apiUrl = "/file/";
      var req = {
        method: "POST",
        url: apiUrl + "list",
        data: JSON.stringify(request),
      };

      return await apiService.sendRequest(req);
    };

    var _removeFile = async function (id) {
      var apiUrl = "/file/";
      var req = {
        method: "GET",
        url: apiUrl + "delete/" + id,
      };
      return await apiService.sendRequest(req);
    };

    var _saveFile = async function (file) {
      var apiUrl = "/file/";
      var req = {
        method: "POST",
        url: apiUrl + "save",
        data: JSON.stringify(file),
      };
      return await apiService.sendRequest(req);
    };

    filesServiceFactory.getFile = _getFile;
    filesServiceFactory.initFile = _initFile;
    filesServiceFactory.getFiles = _getFiles;
    filesServiceFactory.removeFile = _removeFile;
    filesServiceFactory.saveFile = _saveFile;
    return filesServiceFactory;
  },
]);
