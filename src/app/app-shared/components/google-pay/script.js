sharedComponents.component("googlePay", {
  templateUrl: "/mix-app/views/app-shared/components/google-pay/view.html",
  bindings: {
    items: "=",
    currencyCode: "=",
    totalPriceStatus: "=",
    totalPrice: "=",
    processPaymentData: "&",
  },
  controller: [
    "$rootScope",
    "$element",
    "gpayService",
    function ($rootScope, $element, service) {
      var ctrl = this;
      ctrl.merchantInfo = {
        merchantId: "BCR2DN6TV7RIL73C",
        merchantName: "Mixcore",
      };
      ctrl.payPalPaymentMethod = {
        type: "PAYPAL",
        parameters: {
          purchase_context: {
            purchase_units: [
              {
                payee: {
                  merchant_id: "08975416670814987822",
                },
              },
            ],
          },
        },
      };
      ctrl.environment = "TEST";

      ctrl.init = function () {
        ctrl.onGooglePayLoaded($element[0]);
      };

      ctrl.onGooglePayLoaded = function (element) {
        const paymentsClient = service.getGooglePaymentsClient(
          ctrl.merchantInfo,
          ctrl.onPaymentAuthorized
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

      /**
       * Provide Google Pay API with a payment amount, currency, and amount status
       *
       * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
       * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
       */
      ctrl.getGoogleTransactionInfo = function () {
        return {
          displayItems: ctrl.items,
          countryCode: "VN",
          currencyCode: "VND",
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
        const paymentsClient = service.getGooglePaymentsClient(
          ctrl.merchantInfo,
          ctrl.onPaymentAuthorized
        );
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
          ctrl.merchantInfo,
          ctrl.onPaymentAuthorized
        );
        paymentsClient.loadPaymentData(paymentDataRequest);
      };

      ctrl.onPaymentAuthorized = function (paymentData) {
        return new Promise(function (resolve, reject) {
          // handle the response
          ctrl
            .processPayment(paymentData)
            .then(function (resp) {
              console.log(resp);
              resolve({ transactionState: "SUCCESS" });
            })
            .catch(function () {
              resolve({
                transactionState: "ERROR",
                error: {
                  intent: "PAYMENT_AUTHORIZATION",
                  message: "Insufficient funds",
                  reason: "PAYMENT_DATA_INVALID",
                },
              });
            });
        });
      };

      /**
       * Process payment data returned by the Google Pay API
       *
       * @param {object} paymentData response from Google Pay API after user approves payment
       * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
       */
      ctrl.processPayment = async function (paymentData) {
        return await ctrl.processPaymentData({ paymentData: paymentData });
      };
    },
  ],
});
