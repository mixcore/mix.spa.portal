"use strict";
appShared.factory("RestMixAssociationPortalService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-association");
    return serviceFactory;
  },
]);
