"use strict";
app.factory("TemplateService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("template", true);
    var _copy = async function (id) {
      var url = this.prefixUrl + "/copy/" + id;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    serviceFactory.copy = _copy;
    return serviceFactory;
  },
]);
