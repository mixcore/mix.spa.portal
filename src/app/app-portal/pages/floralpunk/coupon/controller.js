"use strict";
app.controller("FloralpunkCouponController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "FloralpunkCouponRuleService",
  "FloralpunkCouponService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    ruleService,
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
    $scope.initList = function () {
      $scope.getList();
    };

    $scope.removeRule = async function (ruleId) {
      if (ruleId && confirm("Remove this rule")) {
        await ruleService.delete([ruleId]);
        await $scope.getSingle();
      }
    };
    $scope.preview = function (item) {
      $rootScope.preview("qr-code", item, item.code, "modal-lg");
    };
  },
]);
