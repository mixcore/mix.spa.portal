"use strict";
appShared.factory("RestMixDatabaseDataClientService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-data/form", false);
    var _initData = async function (mixDatabaseName) {
      var url = this.prefixUrl + "/init/" + mixDatabaseName;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };
    var _saveData = async function (mixDatabaseName, objData) {
      var url = this.prefixUrl + "/save-data/" + mixDatabaseName;
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.getRestApiResult(req);
    };
    serviceFactory.initData = _initData;
    serviceFactory.saveData = _saveData;
    return serviceFactory;
  },
]);
