﻿app.component("customerOrders", {
  templateUrl:
    "/mix-app/views/app-portal/pages/customer/components/orders/customer-orders.html",
  controller: [
    "$rootScope",
    "OrderServices",
    function ($rootScope, orderServices) {
      var ctrl = this;
      ctrl.removeOrder = function (id) {
        $rootScope.showConfirm(
          ctrl,
          "removeOrderConfirmed",
          [id],
          null,
          "Remove Order",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };

      ctrl.removeOrderConfirmed = async function (id) {
        var result = await orderServices.removeOrder(id);
        if (result.success) {
          $rootScope.showMessage("success", "success");
          window.top.location = window.top.location.href;
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
  bindings: {
    customer: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
