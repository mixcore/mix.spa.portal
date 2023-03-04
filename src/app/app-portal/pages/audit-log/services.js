"use strict";
app.factory("AuditLogRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("audit-log");
    return serviceFactory;
  },
]);
