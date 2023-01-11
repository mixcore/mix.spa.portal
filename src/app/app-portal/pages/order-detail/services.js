"use strict";
app.factory("RestOrderDetailService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.initService("/rest/ecommerce", "order-detail");
    var _updateOrderStatus = async function (id, objData) {
      var url = `${this.prefixUrl}/update-order-status/${id}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.updateOrderStatus = _updateOrderStatus;
    return serviceFactory;
  },
]);
