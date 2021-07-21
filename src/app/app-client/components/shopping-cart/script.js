modules.component("shoppingCart", {
  templateUrl: "/mix-app/views/app-client/components/shopping-cart/view.html",
  bindings: {
    cartData: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "localStorageService",
    "ApiService",
    "CommonService",
    "RestMixDatabaseDataClientService",
    function (
      $rootScope,
      $scope,
      localStorageService,
      apiService,
      commonService,
      dataService
    ) {
      var ctrl = this;
      ctrl.submitted = false;
      ctrl.isShow = false;
      ctrl.$onInit = function () {
        ctrl.cartModal = new bootstrap.Modal(
          document.getElementById("modal-shopping-cart")
        );
        if (!ctrl.cartData) {
          ctrl.cartData = {
            items: [],
          };
        }
      };
      ctrl.translate = $rootScope.translate;
      ctrl.edm =
        'Url: <a href="[url]">View Tour</a> <br/>Name: [name] <br/>' +
        "Phone: [phone]<br/>" +
        "Email: [email]<br/>" +
        "Quantity: [quantity]<br/>" +
        "Message: [message] <br/>" +
        "property: [property] <br/>Price: [price] <br/>";
      ctrl.init = function () {};
      ctrl.showShoppingCart = function () {
        ctrl.cartModal.show();
      };
      ctrl.calculate = function () {
        ctrl.cartData.total = 0;
        ctrl.cartData.totalItem = ctrl.cartData.items.length;
        angular.forEach(ctrl.cartData.items, function (e) {
          ctrl.cartData.total += parseInt(e.price) * e.quantity;
        });
        localStorageService.set("shoppingCart", ctrl.cartData);
      };
      ctrl.removeItem = function (index) {
        ctrl.cartData.items.splice(index, 1);
        ctrl.calculate();
      };
      ctrl.book = async function () {
        // ctrl.edm = ctrl.edm.replace(/\[url\]/g, window.top.location.href);
        // ctrl.edm = ctrl.edm.replace(/\[name\]/g, ctrl.order.name);
        // ctrl.edm = ctrl.edm.replace(/\[phone\]/g, ctrl.order.phone);
        // ctrl.edm = ctrl.edm.replace(/\[email\]/g, ctrl.order.email);
        // ctrl.edm = ctrl.edm.replace(/\[message\]/g, ctrl.order.message);
        // ctrl.edm = ctrl.edm.replace(/\[property\]/g, ctrl.order.propertyId);
        // ctrl.edm = ctrl.edm.replace(/\[price\]/g, ctrl.order.price);
        // ctrl.edm = ctrl.edm.replace(/\[quantity\]/g, ctrl.order.quantity);

        //TODO Handle cart submit
        // commonService.sendMail("Booking - " + ctrl.propertyName, ctrl.edm);
        ctrl.submitted = true;
        var result = await dataService.saveData("shoppingCart", ctrl.cartData);
        if (result.isSucceed) {
          setTimeout(() => {
            ctrl.submitted = false;
          }, 1000);
          ctrl.cartData = {
            items: [],
            totalItem: 0,
            total: 0,
          };
          localStorageService.set("shoppingCart", ctrl.cartData);
          ctrl.cartModal.hide();
        } else {
          ctrl.errors = result.errors;
        }
        $scope.$apply();
      };
    },
  ],
});
