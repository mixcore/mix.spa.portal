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
  controller: [
    "$rootScope",
    "localStorageService",
    function ($rootScope, localStorageService) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.quantity = ctrl.quantity || 1;
      };
      ctrl.addToCart = function () {
        var current = $rootScope.findObjectByKey(
          ctrl.cartData.items,
          "propertyId",
          ctrl.propertyId
        );
        if (current) {
          current.quantity += parseInt(ctrl.quantity);
        } else {
          var item = {
            propertyId: ctrl.propertyId,
            title: ctrl.title,
            imageUrl: ctrl.imageUrl,
            price: ctrl.price,
            quantity: parseInt(ctrl.quantity) || 1,
          };
          ctrl.cartData.items.push(item);
          ctrl.cartData.totalItem += 1;
        }
        ctrl.cartData.total += parseInt(ctrl.price);
        localStorageService.set("shoppingCart", ctrl.cartData);
      };
    },
  ],
});
