"use strict";
app.factory("ModulePostRestService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseRestService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module-post");

    var _search = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = this.prefixUrl;

      if (data) {
        url += "/search?";
        url = url.concat(data);
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _delete = async function (id) {
      var url = this.prefixUrl + "/" + id;
      var req = {
        method: "DELETE",
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    var _updateInfos = async function (modules) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/update-infos",
        data: JSON.stringify(modules),
      };
      return await apiService.sendRequest(req);
    };
    serviceFactory.search = _search;
    serviceFactory.delete = _delete;
    serviceFactory.updateInfos = _updateInfos;
    return serviceFactory;
  },
]);
