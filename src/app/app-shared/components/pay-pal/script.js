sharedComponents.component("payPal", {
  templateUrl: "/mix-app/views/app-shared/components/pay-pal/view.html",
  bindings: {
    cartData: "=?",
    isBusy: "=?",
    onSuccess: "=?", // name of function ex: window.onSuccess => 'onSuccess'
    onFail: "=?", // name of function ex: window.onFail => 'onFail'
  },
  controller: [
    "$rootScope",
    "$scope",
    "localStorageService",
    "RestMixDatabaseDataClientService",
    function ($rootScope, $scope, localStorageService, dataService) {
      var ctrl = this;

      ctrl.init = function () {
        ctrl.cartData =
          ctrl.cartData || localStorageService.get("shoppingCart");
        let total = Math.round(ctrl.cartData.total / 23000);
        paypal
          .Buttons({
            createOrder: function (data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total,
                      currency_code: "USD",
                    },
                  },
                ],
              });
            },
            onApprove: function (data, actions) {
              // This function captures the funds from the transaction.
              var obj = {
                data: data,
              };
              return actions.order.capture().then(async function (details) {
                // This function shows a transaction success message to your buyer.
                obj.details = details;
                ctrl.cartData.status = details.status;
                ctrl.cartData.paypalLogs = [obj];
                ctrl.isBusy = true;
                var saveCart = await dataService.saveData(
                  "shoppingCart",
                  ctrl.cartData,
                  true
                );
                ctrl.isBusy = false;
                $scope.$apply();
                if (saveCart.isSucceed) {
                  localStorageService.set("shoppingCart", null);
                  if (ctrl.onSuccess && ctrl.cartData.status === "COMPLETED") {
                    $rootScope.executeFunctionByName(
                      ctrl.onSuccess,
                      [ctrl.cartData],
                      window
                    );
                  }
                } else {
                  if (ctrl.onFail && ctrl.cartData.status === "COMPLETED") {
                    $rootScope.executeFunctionByName(
                      ctrl.onFail,
                      [ctrl.cartData],
                      window
                    );
                  }
                }

                // dataService.saveData("paypal", obj);
              });
            },
          })
          .render("#paypal-button-container");
        //This function displays Smart Payment Buttons on your web page.
      };
    },
  ],
});
