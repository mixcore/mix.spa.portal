sharedComponents.component("payPal", {
  templateUrl: "/mix-app/views/app-shared/components/pay-pal/view.html",
  bindings: {
    cartData: "=?",
    successCallback: "&?",
  },
  controller: [
    "$scope",
    "$element",
    "localStorageService",
    function ($scope, $element, localStorageService) {
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
              console.log("data: ", data);
              console.log("actions: ", actions);
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                console.log("details: ", details);
                alert(
                  "Transaction completed by " + details.payer.name.given_name
                );
              });
            },
          })
          .render("#paypal-button-container");
        //This function displays Smart Payment Buttons on your web page.
      };
    },
  ],
});
