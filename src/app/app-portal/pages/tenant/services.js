"use strict";
app.factory("TenantRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-tenant");
    return serviceFactory;
  },
]);
