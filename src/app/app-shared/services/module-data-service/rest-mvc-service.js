"use strict";
appShared.factory("RestMvcModuleDataService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module-data/mvc");
    var _initForm = async function (moduleContentId) {
      var url = `${this.prefixUrl}/init-form/${moduleContentId}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    serviceFactory.initForm = _initForm;
    return serviceFactory;
  },
]);
