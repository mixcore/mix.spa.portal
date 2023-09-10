"use strict";
app.factory("RestMixDatabaseContextService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mixdb-context");

    var _getByName = async function (name) {
      var url = `${this.prefixUrl}/get-by-name/${name}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.getByName = _getByName;
    return serviceFactory;
  },
]);
