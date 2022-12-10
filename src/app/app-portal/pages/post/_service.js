"use strict";
app.factory("PostRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-post-content");
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
    return serviceFactory;
  },
]);
