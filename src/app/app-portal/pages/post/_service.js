"use strict";
app.factory("PostRestService", [
  "BaseRestService",
  "ApiService",
  function (baseService, apiService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-post-content");
    var _syncProducts = async function (names) {
      var url = `/api/daphale/sync/products`;
      var req = {
        serviceBase: "",
        method: "POST",
        url: url,
        data: {
          batch: 50,
          isScaleImage: true,
          isSyncPrice: true,
          isSyncAll: false,
          productNames: names,
        },
      };
      return await apiService.sendPureRequest(req);
    };
    var _filter = async function (request) {
      var url = `${this.prefixUrl}/filter`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: request,
      };
      return await this.getRestApiResult(req);
    };
    // Define more service methods here
    serviceFactory.filter = _filter;
    serviceFactory.syncProducts = _syncProducts;
    return serviceFactory;
  },
]);
