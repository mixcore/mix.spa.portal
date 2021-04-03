"use strict";
appShared.factory("RestMixDatabasePortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database/portal", true);
    return serviceFactory;
  },
]);
