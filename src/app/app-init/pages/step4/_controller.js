"use strict";
app.controller("Step4Controller", [
  "$scope",
  "$rootScope",
  "CommonService",
  "AuthService",
  "Step4Services",
  function ($scope, $rootScope, commonService, authService, service) {
    $scope.importThemeDto = null;
    $scope.canContinue = true;
    $scope.data = [];
    $scope.init = async function () {
      var getData = await service.loadTheme();
      if (getData.success) {
        $scope.importThemeDto = getData.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.submit = async function () {
      $rootScope.isBusy = true;
      var result = await service.submit($scope.importThemeDto);
      if (result.success) {
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
