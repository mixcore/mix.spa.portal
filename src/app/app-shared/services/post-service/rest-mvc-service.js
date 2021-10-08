"use strict";
appShared.factory("RestMvcPostService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-post/mvc");
    // Define more service methods here
    return serviceFactory;
  },
]);
