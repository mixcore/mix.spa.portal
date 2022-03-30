"use strict";
app.factory("KiotvietProductService", [
  "BaseKiotvietService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("products");
    // Define more service methods here
    return serviceFactory;
  },
]);
