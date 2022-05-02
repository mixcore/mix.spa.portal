"use strict";
app.factory("FloralpunkCouponRuleService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("floralpunk/coupon-rule");
    serviceFactory.prefixUrl = `/api/floralpunk/coupon-rule`;
    serviceFactory.customBaseUrl = true;
    return serviceFactory;
  },
]);
