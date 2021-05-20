"use strict";
appShared.factory("RestRelatedAttributeDataPortalService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-database-data-association/portal");
    return serviceFactory;
  },
]);
