"use strict";
app.factory("RestNavigationService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-database-data/navigation");
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

    serviceFactory.initData = _initData;
    serviceFactory.export = _export;
    return serviceFactory;
  },
]);
