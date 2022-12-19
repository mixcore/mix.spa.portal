"use strict";
app.factory("UrlAliasService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseRestService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.initService("/rest/mix-library", "mix-url-alias");

    var _updateInfos = async function (pages) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/update-infos",
        data: JSON.stringify(pages),
      };
      return await apiService.sendRequest(req);
    };
    serviceFactory.updateInfos = _updateInfos;
    return serviceFactory;
  },
]);
