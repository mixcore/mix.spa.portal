"use strict";
app.factory("FileServices", [
  "$http",
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($http, $rootScope, apiService, commonService, baseService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var filesServiceFactory = angular.copy(baseService);
    filesServiceFactory.init("file", true);
    var settings = $rootScope.globalSettings;

    var _getFile = async function (folder, filename) {
      var apiUrl = "/file/";
      var url = apiUrl + "details?folder=" + folder + "&filename=" + filename;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };

    var _initFile = async function (type) {
      var apiUrl = "/file/";
      var req = {
        method: "GET",
        url: apiUrl + "init/" + type,
      };
      return await apiService.getApiResult(req);
    };

    var _getFiles = async function (request) {
      var apiUrl = "/file/";
      var req = {
        method: "POST",
        url: apiUrl + "list",
        data: JSON.stringify(request),
      };

      return await apiService.getApiResult(req);
    };

    var _removeFile = async function (fullPath) {
      var apiUrl = "/file/";
      var req = {
        method: "GET",
        url: apiUrl + "delete/?fullPath=" + fullPath,
      };
      return await apiService.getApiResult(req);
    };

    var _saveFile = async function (file) {
      var apiUrl = "/file/";
      var req = {
        method: "POST",
        url: apiUrl + "save",
        data: JSON.stringify(file),
      };
      return await apiService.getApiResult(req);
    };
    var _uploadFile = async function (file, folder) {
      var apiUrl = "/file/upload-file";
      var fd = new FormData();
      fd.append("folder", folder);
      fd.append("file", file);
      return await filesServiceFactory.ajaxSubmitForm(fd, apiUrl);
    };

    filesServiceFactory.getFile = _getFile;
    filesServiceFactory.initFile = _initFile;
    filesServiceFactory.getFiles = _getFiles;
    filesServiceFactory.removeFile = _removeFile;
    filesServiceFactory.saveFile = _saveFile;
    filesServiceFactory.uploadFile = _uploadFile;
    return filesServiceFactory;
  },
]);
