"use strict";
appShared.factory("RestMixDatabasePortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database/portal", true);
    var _migrate = async function (data) {
      var url = `${this.prefixUrl}/migrate/${data.id}`;
      var req = {
        method: "POST",
        url: url,
        data: JSON.stringify(data),
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.migrate = _migrate;
    return serviceFactory;
  },
]);
