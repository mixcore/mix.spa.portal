﻿"use strict";
app.factory("ModulePostRestService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module-post");
    var _delete = async function (moduleContentId, postId) {
      var url = this.prefixUrl + "/delete/" + moduleContentId + "/" + postId;
      var req = {
        method: "GET",
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
    serviceFactory.delete = _delete;
    serviceFactory.updateInfos = _updateInfos;
    return serviceFactory;
  },
]);
