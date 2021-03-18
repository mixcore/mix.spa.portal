"use strict";
appShared.factory("RestMixDatabasePortalService", [
  "BaseRestService",
  "CommonService",
  function (baseService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database/portal", true);
    return serviceFactory;
  },
]);
