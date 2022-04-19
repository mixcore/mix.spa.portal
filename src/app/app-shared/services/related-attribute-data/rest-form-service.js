"use strict";
appShared.factory("RestRelatedAttributeDataFormService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-data-content-association/form");
    return serviceFactory;
  },
]);
