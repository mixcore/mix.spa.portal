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

    $scope.removeUserCoupon = async function (couponId) {
      if (couponId && confirm("Remove this coupon")) {
        await couponService.delete([couponId]);
        await $scope.getSingle();
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
