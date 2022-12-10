"use strict";
app.factory("PostPostRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-post-post");

    var _search = async function (request) {
      var url = `${this.prefixUrl}/search`;
      var data = serviceFactory.parseQuery(request);
      if (data) {
        url = `${url}?${url.concat(data)}`;
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    // Define more service methods here
    serviceFactory.search = _search;
    return serviceFactory;
  },
]);
