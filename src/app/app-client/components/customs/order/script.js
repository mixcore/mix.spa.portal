modules.component("tclOrder", {
  binding: {
    user: "=",
  },
  templateUrl: "/mix-app/views/app-client/components/customs/order/view.html",
  controller: [
    "$scope",
    "$rootScope",
    "ngAppSettings",
    "RestMixDatabaseDataClientService",
    function ($scope, $rootScope, ngAppSettings, service) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.request.mixDatabaseName = "tcl_package";
      ctrl.packages = [];
      ctrl.$onInit = async function () {
        ctrl.user = $rootScope.user;

        if (ctrl.user.obj.order_packages.length == 0) {
          await ctrl.loadDefaultPackages();
          ctrl.saveDefaultData().then(() => {
            service.clearCache([ctrl.user.obj.id]);
          });
        }
        ctrl.totalUnit = 0;
        angular.forEach(ctrl.user.obj.order_packages, function (pack) {
          ctrl.calculateItems(pack);
          if (pack.obj.quantity > 0) {
            ctrl.totalUnit += pack.obj.total * pack.obj.quantity;
          }
        });
      };

      ctrl.loadDefaultPackages = async function () {
        $rootScope.isBusy = true;
        ctrl.request.parentId = ctrl.user.id;
        ctrl.request.parentType = "Set";
        var getPackages = await service.getList(ctrl.request);
        if (getPackages.isSucceed) {
          ctrl.user.obj.order_packages = getPackages.data.items;
          angular.forEach(ctrl.user.obj.order_packages, function (pack) {
            pack.parentId = ctrl.user.id;
            pack.mixDatabaseId = 0;
            pack.parentType = "Set";
            pack.status = 2;
            pack.mixDatabaseName = "order_package";
            pack.id = null;
            pack.obj.quantity = 0;
            pack.obj.total = 0;
            pack.parentId = ctrl.user.id;
            pack.parentType = "Set";
            angular.forEach(pack.obj.package_slots, function (slot) {
              slot.id = null;
              slot.mixDatabaseName = "order_package_slot";
              slot.parentType = "Set";
              slot.status = 2;
              slot.mixDatabaseId = 0;
              angular.forEach(slot.obj.package_items, function (item) {
                item.id = null;
                item.mixDatabaseName = "order_package_item";
                item.parentType = "Set";
                item.mixDatabaseId = 0;
              });
            });
          });
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.saveDefaultData = async function () {
        angular.forEach(ctrl.user.obj.order_packages, async function (pack) {
          var savePackage = await ctrl.saveData(pack);
          if (savePackage.isSucceed) {
            pack.id = savePackage.data.id;
            pack.mixDatabaseId = savePackage.data.mixDatabaseId;
            pack.obj.id = savePackage.data.id;
            angular.forEach(pack.obj.gifts, async function (gift) {
              gift.parentId = pack.id;
              gift.parentType = "Set";
              await ctrl.saveData(gift);
            });
            angular.forEach(pack.obj.package_slots, async function (slot) {
              slot.parentId = pack.id;

              var saveSlot = await ctrl.saveData(slot);
              if (saveSlot.isSucceed) {
                slot.mixDatabaseId = saveSlot.data.mixDatabaseId;
                slot.id = saveSlot.data.id;
                slot.mixDatabaseId = saveSlot.data.mixDatabaseId;
                slot.obj.id = saveSlot.data.id;
                slot.status = 2;
                angular.forEach(slot.obj.package_items, async function (item) {
                  item.parentId = slot.id;

                  var saveItem = await ctrl.saveData(item);
                  if (saveItem.isSucceed) {
                    item.id = saveItem.data.id;
                    item.obj.id = saveItem.data.id;
                    item.mixDatabaseId = saveItem.data.mixDatabaseId;
                    angular.forEach(
                      item.obj.products,
                      async function (product) {
                        product.parentId = item.id;
                        product.parentType = "Set";
                        await ctrl.saveData(product);
                      }
                    );
                  }
                });
              }
            });
          }
        });
      };
      ctrl.isBusy = false;
      ctrl.translate = $rootScope.translate;

      ctrl.updatePackageQuantity = async function (pack, value) {
        pack.obj.quantity += value;
        var result = await ctrl.saveData(pack);
        ctrl.handleResult(result);
        ctrl.totalUnit += value * pack.obj.total;
        service.clearCache([ctrl.user.obj.id]);
        // ctrl.calculateItems();
      };

      ctrl.updateItemQuantity = async function (pack, item, value) {
        const newVal = item.obj.quantity + value;
        if (newVal < 0) {
          return;
        }
        if (item.obj.max_quantity >= newVal) {
          item.obj.quantity = newVal;
          var result = await ctrl.saveData(item);
          ctrl.handleResult(result);
          ctrl.calculateItems(pack);
          if (!pack.isValid) {
            ctrl.totalUnit -= pack.obj.unit * pack.obj.quantity;
            pack.obj.quantity = 0;
          }
          service.clearCache([pack.id]);
        } else {
          alert(
            `Bạn không thể mua nhiều hơn ${item.obj.max_quantity} sản phẩm ${item.obj.product_title}`
          );
        }
      };

      ctrl.calculateItems = function (pack) {
        pack.obj.total = 0;
        angular.forEach(pack.obj.package_slots, function (slot) {
          slot.obj.total_unit = 0;
          angular.forEach(slot.obj.package_items, function (item) {
            slot.obj.total_unit += item.obj.quantity;
          });
          pack.obj.total += slot.obj.total_unit;
        });
        pack.isValid = pack.obj.total == pack.obj.unit;
      };

      ctrl.submit = async function () {
        if (ctrl.validate()) {
          $rootScope.isBusy = true;
          var result = await service.save(ctrl.user);
          ctrl.handleResult(result);
        }
      };

      ctrl.saveData = async function (data) {
        var result = await service.save(data);
        return result;
      };

      ctrl.handleResult = function (result) {
        if (result.isSucceed) {
          ctrl.onSuccess(result);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          ctrl.onFail(result);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.validate = function () {
        let result = true;
        angular.forEach(ctrl.user.obj.order_packages, function (pack) {
          if (!pack.isValid && pack.obj.quantity > 0) {
            result = false;
            alert(`${pack.obj.title} chỉ chấp nhận ${pack.obj.unit} sản phẩm`);
          }
        });
        return result;
      };
      ctrl.onSuccess = function (result) {
        $rootScope.isLogin = true;
        $rootScope.isBusy = false;
        $scope.$apply();
      };

      ctrl.onFail = function (result) {
        ctrl.msg = {
          color: "red",
          text: "Sai tên đăng nhập hoặc mật khẩu!",
        };
        $rootScope.isBusy = false;
        $scope.$apply();
      };

      ctrl.export = function () {
        if (ctrl.validate()) {
          $rootScope.isBusy = true;
          var canvasdiv = document.getElementById("receipt");
          html2canvas(canvasdiv, {
            backgroundColor: "#5b4298",
          }).then((canvas) => {
            var a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = ctrl.user.obj.username + "_receipt_.png";
            a.click();
            $rootScope.isBusy = false;
            $scope.$apply();
          });
        }
      };
    },
  ],
});
