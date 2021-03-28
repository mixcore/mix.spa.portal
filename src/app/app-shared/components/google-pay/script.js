modules.component("googlePay", {
  templateUrl: "/mix-app/views/app-shared/components/google-pay/view.html",
  bindings: {
    totalPriceStatus: "=",
    currencyCode: "=",
    totalPrice: "=",
  },
  controller: [
    "$rootScope",
    "$element",
    "gpayService",
    function ($rootScope, $element, service) {
      var ctrl = this;
      ctrl.merchantInfo = {
        merchantId: "01234567890123456789",
        merchantName: "Example Merchant",
      };
      ctrl.environment = "TEST";

      ctrl.init = function () {
        ctrl.onGooglePayLoaded($element[0]);
      };

      ctrl.onGooglePayLoaded = function (element) {
        const paymentsClient = service.getGooglePaymentsClient(
          ctrl.merchantInfo
        );
        paymentsClient
          .isReadyToPay(service.getGoogleIsReadyToPayRequest())
          .then(function (response) {
            if (response.result) {
              ctrl.addGooglePayButton(element);
              // @todo prefetch payment data to improve performance after confirming site functionality
              // prefetchGooglePaymentData();
            }
          })
          .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
          });
      };

      ctrl.getGoogleTransactionInfo = function () {
        return {
          displayItems: [],
          countryCode: "US",
          currencyCode: "USD",
          totalPriceStatus: "FINAL",
          totalPrice: `${ctrl.totalPrice}`,
          totalPriceLabel: "Total",
        };
      };

      /**
       * Add a Google Pay purchase button alongside an existing checkout button
       *
       * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
       * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
       */
      ctrl.addGooglePayButton = function (element) {
        const paymentsClient = service.getGooglePaymentsClient();
        const button = paymentsClient.createButton({
          buttonColor: "default",
          buttonType: "plain",
          buttonSizeMode: "fill",
          onClick: ctrl.onGooglePaymentButtonClicked,
        });
        element.appendChild(button);
        // @todo prefetch payment data to improve performance after confirming site functionality
        // prefetchGooglePaymentData();
      };

      /**
       * Show Google Pay payment sheet when Google Pay payment button is clicked
       */
      ctrl.onGooglePaymentButtonClicked = function () {
        let transactionInfo = ctrl.getGoogleTransactionInfo();
        const paymentDataRequest = service.getGooglePaymentDataRequest(
          ctrl.merchantInfo,
          transactionInfo
        );
        paymentDataRequest.transactionInfo = transactionInfo;

        const paymentsClient = service.getGooglePaymentsClient(
          ctrl.merchantInfo
        );
        paymentsClient.loadPaymentData(paymentDataRequest);
      };
    },
  ],
});
