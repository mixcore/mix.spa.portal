"use strict";
app.factory("RestPortalPageNavigationService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("portal-page-navigation", true);

    return serviceFactory;
  },
]);
