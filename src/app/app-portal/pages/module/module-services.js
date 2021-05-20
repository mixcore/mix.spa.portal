"use strict";
app.factory("ModuleRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module/portal");
    // Define more service methods here
    return serviceFactory;
  },
]);
