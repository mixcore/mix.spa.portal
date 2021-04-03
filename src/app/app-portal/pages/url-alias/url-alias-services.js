"use strict";
app.factory("UrlAliasService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("url-alias");

    var _updateInfos = async function (pages) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/update-infos",
        data: JSON.stringify(pages),
      };
      return await apiService.getApiResult(req);
    };
    serviceFactory.updateInfos = _updateInfos;
    return serviceFactory;
  },
]);
