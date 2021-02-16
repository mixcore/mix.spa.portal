"use strict";
app.factory("MixDatabaseService", [
  "BaseRestService",
  function(baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database/portal", true);
    // Define more service methods here
    return serviceFactory;
  },
]);
