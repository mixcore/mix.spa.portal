"use strict";
app.factory("DomainRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-domain");
    return serviceFactory;
  },
]);
