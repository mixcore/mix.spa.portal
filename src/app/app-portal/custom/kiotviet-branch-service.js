"use strict";
app.factory("KiotvietBranchService", [
  "BaseKiotvietService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("branches");
    // Define more service methods here
    return serviceFactory;
  },
]);
