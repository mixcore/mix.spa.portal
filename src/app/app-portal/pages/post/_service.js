"use strict";
app.factory("PostRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-post-content");
    // Define more service methods here
    return serviceFactory;
  },
]);
