"use strict";
app.factory("RestMixDatabaseColumnPortalService", [
  "BaseRestService",
  "CommonService",
  function (baseService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-column/portal", true);
    var _initData = async function (mixDatabaseName) {
      var url = this.prefixUrl + "/init/" + mixDatabaseName;
      var req = {
        method: "GET",
        url: url,
      };
      return await commonService.getRestApiResult(req);
    };
    serviceFactory.initData = _initData;
    return serviceFactory;
  },
]);
