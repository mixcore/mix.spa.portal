"use strict";
appShared.factory("ModalPostRestService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("page-post");
    return serviceFactory;
  },
]);
