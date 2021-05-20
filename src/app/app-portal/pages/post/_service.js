"use strict";
app.factory("PostRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("post/portal");
    // Define more service methods here
    return serviceFactory;
  },
]);
