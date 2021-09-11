sharedComponents.component("onePay", {
  templateUrl: "/mix-app/views/app-shared/components/one-pay/view.html",
  bindings: {
    cartData: "=?",
    successCallback: "&?",
  },
  controller: "OnePayShoppingCartController",
});

sharedComponents.controller("OnePayShoppingCartController", [
  "$rootScope",
  "$scope",
  "$controller",
  "localStorageService",
  "RestMixDatabaseDataClientService",
  function ($rootScope, $scope, $controller, localStorageService, dataService) {
    angular.extend(
      this,
      $controller("ShoppingCartController", { $scope: $scope })
    );
    $scope.url = " https://mtf.onepay.vn/onecomm-pay/vpc.op";

    $scope.init = async function (
      validateCallback,
      successCallback,
      failCallback
    ) {
      $scope.validateCallback = validateCallback;
      $scope.successCallback = successCallback;
      $scope.failCallback = failCallback;

      $scope.cartData =
        $scope.cartData || localStorageService.get("shoppingCart");
      $scope.initRequest();
      $scope.initResponse();
    };

    $scope.initRequest = async function () {
      var getRequest = await dataService.initData("onepayRequest");
      $scope.request = getRequest.data;
      $scope.request.obj.vpc_Amount = $scope.cartData.total;
      $scope.request.obj.vpc_ReturnURL = window.top.location.href;
      $scope.request.obj.AgainLink = window.top.location.href;
    };
    $scope.initResponse = async function () {
      var getResponse = await dataService.initData("onepayResponse");
      $scope.response = getResponse.data.obj;
    };
    $scope.onSuccess = async function (resp) {
      $scope.cartData = resp;
      localStorageService.set("shoppingCart", $scope.cartData);

      $scope.request.obj.vpc_MerchTxnRef = resp.id;
      $scope.request.obj.vpc_OrderInfo = resp.id;
      $scope.request.obj.Title = `Order ${$scope.cartData.name}`;
      dataService.save($scope.request);

      $scope.url = `${$scope.url}?${dataService.parseQuery(
        $scope.request.obj
      )}`;
      window.top.location = $scope.url;
    };
    $scope.paymentSuccess = async function (resp) {
      await dataService.saveValues($scope.cartData.id, { status: "Paid" });

      if ($scope.successCallback) {
        $rootScope.executeFunctionByName(
          $scope.successCallback,
          [resp],
          window
        );
      } else {
        window.location.href = "/";
      }
    };
  },
]);
