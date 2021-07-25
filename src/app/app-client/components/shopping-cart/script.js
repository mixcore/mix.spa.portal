modules.component("shoppingCart", {
  templateUrl: "/mix-app/views/app-client/components/shopping-cart/view.html",
  bindings: {
    cartData: "=?",
  },
  controller: "ShoppingCartController",
});
modules.controller("ShoppingCartController", [
  "$rootScope",
  "$scope",
  "$element",
  "localStorageService",
  "ApiService",
  "CommonService",
  "RestMixDatabaseDataClientService",
  function (
    $rootScope,
    $scope,
    $element,
    localStorageService,
    apiService,
    commonService,
    dataService
  ) {
    var ctrl = this;
    $scope.submitted = false;
    $scope.isShow = false;
    $scope.init = function () {
      $scope.submitting = true;
      $scope.cartModal = new bootstrap.Modal($element.find(".modal")[0]);
      if (!$scope.cartData) {
        $scope.cartData = {
          items: [],
        };
      }
    };
    $scope.translate = $rootScope.translate;
    $scope.edm =
      'Url: <a href="[url]">View Tour</a> <br/>Name: [name] <br/>' +
      "Phone: [phone]<br/>" +
      "Email: [email]<br/>" +
      "Quantity: [quantity]<br/>" +
      "Message: [message] <br/>" +
      "property: [property] <br/>Price: [price] <br/>";
    $scope.init = function () {};
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
    $scope.book = async function () {
      // $scope.edm = $scope.edm.replace(/\[url\]/g, window.top.location.href);
      // $scope.edm = $scope.edm.replace(/\[name\]/g, $scope.order.name);
      // $scope.edm = $scope.edm.replace(/\[phone\]/g, $scope.order.phone);
      // $scope.edm = $scope.edm.replace(/\[email\]/g, $scope.order.email);
      // $scope.edm = $scope.edm.replace(/\[message\]/g, $scope.order.message);
      // $scope.edm = $scope.edm.replace(/\[property\]/g, $scope.order.propertyId);
      // $scope.edm = $scope.edm.replace(/\[price\]/g, $scope.order.price);
      // $scope.edm = $scope.edm.replace(/\[quantity\]/g, $scope.order.quantity);

      //TODO Handle cart submit
      // commonService.sendMail("Booking - " + $scope.propertyName, $scope.edm);
      //   $scope.submitted = true;
      $scope.frmCheckOut.$$element.addClass("was-validated");
      if ($scope.frmCheckOut.$valid) {
        $rootScope.submitting = true;
        var result = await dataService.saveData(
          "shoppingCart",
          $scope.cartData
        );
        if (result.isSucceed) {
          setTimeout(() => {
            $scope.submitting = false;
          }, 1000);
          $scope.cartData = {
            items: [],
            totalItem: 0,
            total: 0,
          };
          localStorageService.set("shoppingCart", $scope.cartData);
          window.location.href = "/";
        } else {
          $scope.errors = result.errors;
        }
        $scope.$apply();
      }
    };
  },
]);
