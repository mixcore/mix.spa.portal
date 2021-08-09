modules.component("shoppingCart", {
  templateUrl: "/mix-app/views/app-client/components/shopping-cart/view.html",
  bindings: {
    cartData: "=?",
    successCallback: "&?",
  },
  controller: "ShoppingCartController",
});
modules.controller("ShoppingCartController", [
  "$rootScope",
  "$scope",
  "$element",
  "localStorageService",
  "RestMixDatabaseDataClientService",
  function ($rootScope, $scope, $element, localStorageService, dataService) {
    $scope.submitted = false;
    $scope.isShow = false;
    $scope.init = function (validateCallback, successCallback, failCallback) {
      $scope.validateCallback = validateCallback;
      $scope.successCallback = successCallback;
      $scope.failCallback = failCallback;
    };
    $scope.translate = $rootScope.translate;

    $scope.showShoppingCart = function () {
      $scope.cartModal.show();
    };
    $scope.calculate = function () {
      $scope.cartData.total = 0;
      $scope.cartData.totalItem = $scope.cartData.items.length;
      angular.forEach($scope.cartData.items, function (e) {
        $scope.cartData.total += parseInt(e.price) * e.quantity;
      });
      localStorageService.set("shoppingCart", $scope.cartData);
    };
    $scope.removeItem = function (index) {
      $scope.cartData.items.splice(index, 1);
      $scope.calculate();
    };
    $scope.submit = async function () {
      $scope.onValidate();
      if ($scope.frmCheckOut.$valid) {
        $rootScope.submitting = true;
        var result = await dataService.saveData(
          "shoppingCart",
          $scope.cartData
        );
        if (result.isSucceed) {
          $scope.onSuccess(result.data);
        } else {
          $scope.onFail(result.errors);
        }
        $scope.$apply();
      }
    };

    $scope.onValidate = async function () {
      $scope.frmCheckOut.$$element.addClass("was-validated");
      if ($scope.validateCallback) {
        let isValid = await $rootScope.executeFunctionByName(
          $scope.validateCallback,
          [$scope.frmCheckOut, $scope.cartData],
          window
        );
        $scope.frmCheckOut.$valid = $scope.frmCheckOut.$valid && isValid;
      }
    };
    $scope.onSuccess = function (resp) {
      setTimeout(() => {
        $scope.submitting = false;
      }, 1000);
      $scope.cartData = {
        items: [],
        totalItem: 0,
        total: 0,
      };
      localStorageService.set("shoppingCart", $scope.cartData);

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
    $scope.onFail = function (errors) {
      if ($scope.failCallback) {
        $rootScope.executeFunctionByName($scope.failCallback, [errors], window);
      }
    };
    $scope.sendmail = async function () {
      let edm =
        'Url: <a href="[url]">View Tour</a> <br/>Name: [name] <br/>' +
        "Phone: [phone]<br/>" +
        "Email: [email]<br/>" +
        "Quantity: [quantity]<br/>" +
        "Message: [message] <br/>" +
        "property: [property] <br/>Price: [price] <br/>";

      edm = edm.replace(/\[url\]/g, window.top.location.href);
      edm = edm.replace(/\[name\]/g, $scope.order.name);
      edm = edm.replace(/\[phone\]/g, $scope.order.phone);
      edm = edm.replace(/\[email\]/g, $scope.order.email);
      edm = edm.replace(/\[message\]/g, $scope.order.message);
      edm = edm.replace(/\[property\]/g, $scope.order.propertyId);
      edm = edm.replace(/\[price\]/g, $scope.order.price);
      edm = edm.replace(/\[quantity\]/g, $scope.order.quantity);

      //   TODO Handle cart submit
      await commonService.sendMail("Booking - " + $scope.propertyName, edm);
      $scope.submitted = true;
    };
  },
]);
