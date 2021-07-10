"use strict";
appShared.factory("ThemeService", [
  "ApiService",
  "BaseRestService",
  function (apiService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("theme/portal");

    var _syncTemplates = async function (id) {
      var url = this.prefixUrl + "/sync/" + id;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    var _install = async function (objData) {
      var url = this.prefixUrl + "/install";
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };
    var _export = async function (id, objData) {
      var url = this.prefixUrl + "/export/" + id;
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };
    var _getExportData = async function (id) {
      var url =
        (this.prefixUrl || "/" + this.lang + "/" + this.modelName) +
        "/export/" +
        id;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    serviceFactory.install = _install;
    serviceFactory.export = _export;
    serviceFactory.syncTemplates = _syncTemplates;
    serviceFactory.getExportData = _getExportData;
    return serviceFactory;
  },
]);
