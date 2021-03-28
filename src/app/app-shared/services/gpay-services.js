"use strict";
appShared.factory("gpayService", [
  "$rootScope",
  "ngAppSettings",
  function ($rootScope, ngAppSettings) {
    var factory = {};
    /**
     * Define the version of the Google Pay API referenced when creating your
     * configuration
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
     */
    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
    };

    /**
     * Card networks supported by your site and your gateway
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     * @todo confirm card networks supported by your site and gateway
     */
    const allowedCardNetworks = [
      "AMEX",
      "DISCOVER",
      "JCB",
      "MASTERCARD",
      "VISA",
    ];

    /**
     * Card authentication methods supported by your site and your gateway
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     * @todo confirm your processor supports Android device tokens for your
     * supported card networks
     */
    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

    /**
     * Identify your gateway and your site's gateway merchant identifier
     *
     * The Google Pay API response will return an encrypted payment method capable
     * of being charged by a supported gateway after payer authorization
     *
     * @todo check with your gateway on the parameters to pass
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
     */
    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      parameters: {
        gateway: "example",
        gatewayMerchantId: "exampleGatewayMerchantId",
      },
    };

    /**
     * Describe your site's support for the CARD payment method and its required
     * fields
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     */
    const baseCardPaymentMethod = {
      type: "CARD",
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
      },
    };

    /**
     * Describe your site's support for the CARD payment method including optional
     * fields
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     */
    const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
      tokenizationSpecification: tokenizationSpecification,
    });

    /**
     * An initialized google.payments.api.PaymentsClient object or null if not yet set
     *
     * @see {@link getGooglePaymentsClient}
     */
    let paymentsClient = null;

    var _init = function (env, merchantId, merchantName) {
      this.environment = env;
      this.merchantId = merchantId;
      this.merchantName = merchantName;
    };

    /**
     * Configure your site's support for payment methods supported by the Google Pay
     * API.
     *
     * Each member of allowedPaymentMethods should contain only the required fields,
     * allowing reuse of this base request when determining a viewer's ability
     * to pay and later requesting a supported payment method
     *
     * @returns {object} Google Pay API version, payment methods supported by the site
     */
    var _getGoogleIsReadyToPayRequest = function () {
      return Object.assign({}, baseRequest, {
        allowedPaymentMethods: [baseCardPaymentMethod],
      });
    };

    /**
     * Configure support for the Google Pay API
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
     * @returns {object} PaymentDataRequest fields
     */
    var _getGooglePaymentDataRequest = function (merchantInfo, transactionInfo) {
      const paymentDataRequest = Object.assign({}, baseRequest);
      paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
      paymentDataRequest.transactionInfo = transactionInfo;
      paymentDataRequest.merchantInfo = merchantInfo;

      paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
      paymentDataRequest.shippingOptionRequired = false;
      paymentDataRequest.shippingAddressRequired = false;

      return paymentDataRequest;
    };

    /**
     * Return an active PaymentsClient or initialize
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
     * @returns {google.payments.api.PaymentsClient} Google Pay API client
     */
    var _getGooglePaymentsClient = function (merchantInfo) {
      if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({
          environment: this.environment,
          merchantInfo: merchantInfo,
          paymentDataCallbacks: {
            onPaymentAuthorized: this.onPaymentAuthorized,
          },
        });
      }
      return paymentsClient;
    };

    var _onPaymentAuthorized = function (paymentData) {
      return new Promise(function (resolve, reject) {
        // handle the response
        this.processPayment(paymentData)
          .then(function () {
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
     * Provide Google Pay API with a payment amount, currency, and amount status
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
     * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
     */
    var _getGoogleTransactionInfo = function () {
      return {
        displayItems: [],
        countryCode: "US",
        currencyCode: "USD",
        totalPriceStatus: "FINAL",
        totalPrice: "0",
        totalPriceLabel: "Total",
      };
    };

    /**
     * Prefetch payment data to improve performance
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
     */
    var _prefetchGooglePaymentData = function () {
      const paymentDataRequest = getGooglePaymentDataRequest();
      // transactionInfo must be set but does not affect cache
      paymentDataRequest.transactionInfo = {
        totalPriceStatus: "NOT_CURRENTLY_KNOWN",
        currencyCode: "USD",
      };
      const paymentsClient = this.getGooglePaymentsClient();
      paymentsClient.prefetchPaymentData(paymentDataRequest);
    };

    /**
     * Show Google Pay payment sheet when Google Pay payment button is clicked
     */
    var _onGooglePaymentButtonClicked = function (scope) {
      const paymentDataRequest = scope.getGooglePaymentDataRequest();
      paymentDataRequest.transactionInfo = scope.getGoogleTransactionInfo();

      const paymentsClient = scope.getGooglePaymentsClient();
      paymentsClient.loadPaymentData(paymentDataRequest);
    };

    /**
     * Process payment data returned by the Google Pay API
     *
     * @param {object} paymentData response from Google Pay API after user approves payment
     * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
     */
    var _processPayment = function (paymentData) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          // show returned data in developer console for debugging
          console.log(paymentData);
          // @todo pass payment token to your gateway to process payment
          paymentToken = paymentData.paymentMethodData.tokenizationData.token;

          resolve({});
        }, 3000);
      });
    };

    factory.init = _init;
    factory.prefetchGooglePaymentData = _prefetchGooglePaymentData;
    factory.getGooglePaymentsClient = _getGooglePaymentsClient;
    factory.getGoogleTransactionInfo = _getGoogleTransactionInfo;
    factory.onGooglePaymentButtonClicked = _onGooglePaymentButtonClicked;
    factory.getGooglePaymentDataRequest = _getGooglePaymentDataRequest;
    factory.getGoogleIsReadyToPayRequest = _getGoogleIsReadyToPayRequest;
    factory.onPaymentAuthorized = _onPaymentAuthorized;
    factory.processPayment = _processPayment;
    return factory;
  },
]);
