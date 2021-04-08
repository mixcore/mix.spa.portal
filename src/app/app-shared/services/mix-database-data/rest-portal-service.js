"use strict";
appShared.factory("RestMixDatabaseDataPortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-database-data/portal");

    var _saveAdditionalData = async function (objData) {
      var url = this.prefixUrl + "/save-additional-data";
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.getRestApiResult(req);
    };

    var _getAdditionalData = async function (data) {
      var url = this.prefixUrl + "/additional-data";
      var queries = serviceFactory.parseQuery(data);
      if (queries) {
        url += "?";
        url = url.concat(queries);
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };

    var _initData = async function (mixDatabaseName) {
      var url = this.prefixUrl + "/init/" + mixDatabaseName;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };

    var _export = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = this.prefixUrl;

      if (data) {
        url += "/export?";
        url = url.concat(data);
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };

    var _import = async function (mixDatabaseName, file) {
      var url =
        (this.prefixUrl || "/" + this.lang + "/" + this.modelName) +
        "/import-data/" +
        mixDatabaseName;
      var frm = new FormData();
      frm.append("file", file);
      return serviceFactory.ajaxSubmitForm(frm, url);
    };

    var _migrate = async function (mixDatabaseId) {
      var url = this.prefixUrl + "/migrate-data/" + mixDatabaseId;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };

    serviceFactory.migrate = _migrate;
    serviceFactory.initData = _initData;
    serviceFactory.getAdditionalData = _getAdditionalData;
    serviceFactory.saveAdditionalData = _saveAdditionalData;
    serviceFactory.export = _export;
    serviceFactory.import = _import;
    return serviceFactory;
  },
]);
