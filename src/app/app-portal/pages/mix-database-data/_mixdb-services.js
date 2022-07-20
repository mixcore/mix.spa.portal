"use strict";
app.factory("MixDbService", [
  "ApiService",
  "BaseRestService",
  function (apiService, baseService) {
    var serviceFactory = Object.create(baseService);

    var _initDbName = function (name) {
      serviceFactory.init(`mix-db/${name}`);
      // return await apiService.sendRequest(req);
    };
    serviceFactory.initDbName = _initDbName;
    return serviceFactory;
  },
]);
