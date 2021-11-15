"use strict";
app.factory("ModuleRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-module-content");
    // Define more service methods here
    return serviceFactory;
  },
]);
