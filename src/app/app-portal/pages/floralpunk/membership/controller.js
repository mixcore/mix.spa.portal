"use strict";
app.controller("FloralpunkMembershipController", [
  "$scope",
  "$rootScope",
  "$filter",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "FloralpunkUserCouponService",
  "FloralpunkMembershipService",
  function (
    $scope,
    $rootScope,
    $filter,
    ngAppSettings,
    $routeParams,
    $location,
    couponService,
    service
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.levels = ["Base", "Premium", "VIP"];
    $scope.tiers = [
      "Follower",
      "Insider",
      "Believer",
      "Trendsetter",
      "Celebrity",
      "BlackDiamond",
    ];
    $scope.initList = function () {
      $scope.getList();
    };

    $scope.preview = function (item) {
      $rootScope.preview("qr-code", item, item.code, "modal-lg");
    };

    $scope.removeUserCoupon = async function (couponId) {
      if (couponId && confirm("Remove this coupon")) {
        await couponService.delete([couponId]);
        await $scope.getSingle();
      }
    };

    $scope.activeCoupon = async function (coupon) {
      var result = await couponService.saveFields(coupon.id, [
        {
          propertyName: "isActive",
          propertyValue: coupon.isActive,
        },
      ]);
      if (result.success) {
        $rootScope.showMessage("Success", "success");
      } else {
        $rootScope.showErrors(result.errors);
      }
    };

    $scope.getSingleSuccessCallback = function () {
      if ($scope.viewmodel.birthDate) {
        $scope.viewmodel.birthDate = new Date(
          $filter("utcToLocal")($scope.viewmodel.birthDate, "yyyy-MM-ddTHH:mm")
        );
      }
      if ($scope.viewmodel.joinedDate) {
        $scope.viewmodel.joinedDate = new Date(
          $filter("utcToLocal")($scope.viewmodel.joinedDate, "yyyy-MM-ddTHH:mm")
        );
      }
    };
  },
]);
