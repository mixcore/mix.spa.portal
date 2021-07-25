modules.component("addToCartButton", {
  templateUrl:
    "/mix-app/views/app-client/components/add-to-cart-button/view.html",
  bindings: {
    cartData: "=",
    propertyId: "=",
    title: "=",
    imageUrl: "=",
    price: "=",
    quantity: "=?",
  },
  controller: "AddToCartController",
});
modules.controller("AddToCartController", [
  "$rootScope",
  "$scope",
  "localStorageService",
  function ($rootScope, $scope, localStorageService) {
    $scope.init = function () {
      $scope.quantity = $scope.quantity || 1;
    };
    $scope.addToCart = function () {
      var current = $rootScope.findObjectByKey(
        $scope.cartData.items,
        "propertyId",
        $scope.propertyId
      );
      if (current) {
        current.quantity += parseInt($scope.quantity);
      } else {
        var item = {
          propertyId: $scope.propertyId,
          title: $scope.title,
          imageUrl: $scope.imageUrl,
          price: $scope.price,
          quantity: parseInt($scope.quantity) || 1,
        };
        $scope.cartData.items.push(item);
        $scope.cartData.totalItem += 1;
      }
      $scope.cartData.total += parseInt($scope.price);
      localStorageService.set("shoppingCart", $scope.cartData);
    };
  },
]);
