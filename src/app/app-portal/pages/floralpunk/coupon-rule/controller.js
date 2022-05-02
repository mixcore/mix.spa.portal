"use strict";
app.controller("FloralpunkCouponRuleController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "FloralpunkCouponRuleService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
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
    $scope.intervalTypes = [
      "Second",
      "Minute",
      "Hour",
      "Day",
      "Week",
      "Month",
      "Year",
    ];
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
    $scope.getSingleSuccessCallback = async function () {
      if ($routeParams.couponId) {
        $scope.viewmodel.floralpunkCouponId = $routeParams.couponId;
      }
    };
  },
]);
