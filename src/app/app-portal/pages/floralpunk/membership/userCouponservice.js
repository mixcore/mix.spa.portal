"use strict";
app.factory("FloralpunkUserCouponService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.buildRequestUrl = function (req) {
      return req.url;
    };
    serviceFactory.init("floralpunk/user-coupon");
    serviceFactory.prefixUrl = `/api/floralpunk/user-coupon`;
    serviceFactory.customBaseUrl = true;
    return serviceFactory;
  },
]);
