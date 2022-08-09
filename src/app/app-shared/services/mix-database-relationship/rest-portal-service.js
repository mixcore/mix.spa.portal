"use strict";
appShared.factory("RestMixRelationshipPortalService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-relationship");
    return serviceFactory;
  },
]);
