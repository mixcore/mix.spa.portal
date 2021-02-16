"use strict";
app.factory("RestRelatedAttributeDataPortalService", [
  "BaseRestService",
  "CommonService",
  function(baseService, commonService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-database-data-association/portal");
    return serviceFactory;
  },
]);
