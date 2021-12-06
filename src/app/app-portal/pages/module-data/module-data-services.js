"use strict";
app.factory("ModuleDataRestService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-module-data");
    // Define more service methods here

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
