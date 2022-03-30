"use strict";
app.factory("KiotvietOrderService", [
  "BaseKiotvietService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("orders");
    // Define more service methods here
    return serviceFactory;
  },
]);
