"use strict";
app.factory("FileServices", [
  "$http",
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseRestService",
  function ($http, $rootScope, apiService, commonService, baseService) {
    var filesServiceFactory = angular.copy(baseService);
    filesServiceFactory.initService("/rest", "mix-storage/file-system", true);
    var _getFile = async function (folder, filename) {
      var url =
        this.prefixUrl + "/details?folder=" + folder + "&filename=" + filename;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _initFile = async function (type) {
      var req = {
        method: "GET",
        url: this.prefixUrl + "/init/" + type,
      };
      return await apiService.sendRequest(req);
    };

    var _getFiles = async function (request) {
      var url = this.prefixUrl;
      var data = filesServiceFactory.parseQuery(request);
      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        method: "GET",
        url: url,
        data: JSON.stringify(request),
      };
      return await apiService.sendRequest(req);
    };

    var _removeFile = async function (fullPath) {
      var req = {
        method: "GET",
        url: this.prefixUrl + "/delete/?fullPath=" + fullPath,
      };
      return await apiService.sendRequest(req);
    };

    var _saveFile = async function (file) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/save",
        data: JSON.stringify(file),
      };
      return await apiService.sendRequest(req);
    };
    var _uploadFile = async function (file, folder) {
      var apiUrl = this.prefixUrl + "/file/upload-file";
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
