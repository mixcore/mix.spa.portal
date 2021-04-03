"use strict";
app.factory("ModuleGalleryService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("module-post");
    var _delete = async function (moduleId, postId) {
      var url = this.prefixUrl + "/delete/" + moduleId + "/" + postId;
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };
    var _updateInfos = async function (modules) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/update-infos",
        data: JSON.stringify(modules),
      };
      return await apiService.getApiResult(req);
    };
    serviceFactory.delete = _delete;
    serviceFactory.updateInfos = _updateInfos;
    return serviceFactory;
  },
]);
