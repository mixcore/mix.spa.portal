"use strict";
appShared.factory("RestRelatedAttributeDataFormService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-database-data-association/form");
    return serviceFactory;
  },
]);
