"use strict";
appShared.factory("RestRelatedAttributeDataPortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-data-content-association");
    return serviceFactory;
  },
]);
