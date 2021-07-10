﻿"use strict";
app.controller("Step5Controller", [
  "$scope",
  "$rootScope",
  "$location",
  "ApiService",
  "CommonService",
  "Step5Services",
  function ($scope, $rootScope, $location, apiService, commonService, service) {
    var rand = Math.random();
    $scope.data = [];
    $scope.init = async function () {
      var getData = await commonService.loadJsonData("configurations");
      if (getData.isSucceed) {
        $scope.data = getData.data.items;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (getData) {
          $rootScope.showErrors(getData.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.submit = async function () {
      $rootScope.isBusy = true;
      var result = await service.submit($scope.data);
      if (result.isSucceed) {
        $rootScope.isBusy = false;
        window.top.location = "/";
      } else {
        if (result) {
          $rootScope.showErrors(result.errors);
        }
        $rootScope.isBusy = false;
      }
    };
  },
]);
