"use strict";
appShared.factory("RestMvcModuleDataService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module-data/mvc");
    var _initForm = async function (moduleId) {
      var url = `${this.prefixUrl}/init-form/${moduleId}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getRestApiResult(req);
    };
    serviceFactory.initForm = _initForm;
    return serviceFactory;
  },
]);
