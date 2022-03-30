"use strict";
app.factory("KiotvietCustomerService", [
  "BaseKiotvietService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("customers");
    // Define more service methods here
    return serviceFactory;
  },
]);
