"use strict";
app.factory("FloralpunkCouponService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.buildRequestUrl = function (req) {
      return req.url;
    };
    serviceFactory.init("floralpunk/coupon");
    serviceFactory.prefixUrl = `/api/floralpunk/coupon`;
    serviceFactory.customBaseUrl = true;
    return serviceFactory;
  },
]);
