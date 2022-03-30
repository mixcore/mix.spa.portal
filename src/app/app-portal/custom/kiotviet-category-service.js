"use strict";
app.factory("KiotvietCategoryService", [
  "BaseKiotvietService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("categories");
    // Define more service methods here
    return serviceFactory;
  },
]);
