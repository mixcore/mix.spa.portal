"use strict";
app.factory("QueueLogRestService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.initService("/rest", "mix-log/queue-log", true);
    return serviceFactory;
  },
]);
