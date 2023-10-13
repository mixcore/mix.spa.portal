"use strict";
app.factory("QueueLogRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.initService("/rest", "mix-log/queue-log", true);
    var _search = async function (objData, queries = null) {
      var data = serviceFactory.parseQuery(objData);

      var url = `${this.prefixUrl}/search`;

      if (data) {
        url += "?";
        url = url.concat(data);
        if (queries) {
          url += "&";
          var extraQueries = serviceFactory.parseQuery(queries);
          url = url.concat(extraQueries);
        }
      }
      var req = {
        serviceBase: this.serviceBase,
        apiVersion: this.apiVersion,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.getList = _search;
    return serviceFactory;
  },
]);
