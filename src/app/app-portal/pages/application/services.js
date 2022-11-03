"use strict";
app.factory("MixApplicationRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-application");
    var _install = async function (objData) {
      var url = `${this.prefixUrl}/install`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.install = _install;
    return serviceFactory;
  },
]);
