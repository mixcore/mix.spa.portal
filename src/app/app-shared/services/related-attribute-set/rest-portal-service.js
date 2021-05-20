"use strict";
appShared.factory("RestRelatedMixDatabasePortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("related-mix-database/portal");
    return serviceFactory;
  },
]);
