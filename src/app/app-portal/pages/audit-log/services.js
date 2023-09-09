"use strict";
app.factory("AuditLogRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.initService("/rest", "mix-log/audit-log", true);
    return serviceFactory;
  },
]);
