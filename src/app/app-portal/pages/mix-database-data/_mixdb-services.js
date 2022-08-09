"use strict";
app.factory("MixDbService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-db");
    var _initDbName = function (name) {
      serviceFactory.init(`mix-db/${name}`);
    };
    var _getSingleByParent = async function (parentId) {
      var url = `${this.prefixUrl}/get-by-parent/${parentId}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.initDbName = _initDbName;
    serviceFactory.getSingleByParent = _getSingleByParent;
    return serviceFactory;
  },
]);
