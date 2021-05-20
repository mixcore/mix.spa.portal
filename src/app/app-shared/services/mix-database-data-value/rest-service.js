"use strict";
appShared.factory("RestMixDatabaseDataValuePortalService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-data-value/portal");
    return serviceFactory;
  },
]);
