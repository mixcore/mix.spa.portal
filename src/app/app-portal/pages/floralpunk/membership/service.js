"use strict";
app.factory("FloralpunkMembershipService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.buildRequestUrl = function (req) {
      return req.url;
    };
    serviceFactory.init("floralpunk/membership");
    serviceFactory.prefixUrl = `/api/floralpunk/membership`;
    serviceFactory.customBaseUrl = true;
    return serviceFactory;
  },
]);
