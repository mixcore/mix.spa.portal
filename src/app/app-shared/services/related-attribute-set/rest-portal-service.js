"use strict";
app.factory("RestRelatedMixDatabasePortalService", [
  "BaseRestService",
  "CommonService",
  function(baseService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("related-mix-database/portal");
    return serviceFactory;
  },
]);
