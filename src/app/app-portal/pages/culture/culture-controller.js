"use strict";
app.controller("CultureController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "CultureService",
  "CommonService",
  "ApiService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    service,
    commonService,
    apiService
  ) {
    $scope.selected = null;
    BaseCtrl.call(
      this,
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.loadCultures = async function () {
      var getCultures = await commonService.loadJsonData("cultures");
      $scope.cultures = getCultures.data.items;
      $scope.$apply();
    };
    $scope.saveSuccessCallback = function () {
      apiService
        .initAllSettings()
        .then(() => (window.location.href = "/admin/language/list"));
    };
    $scope.removeCallback = function () {
      apiService
        .initAllSettings()
        .then(() => (window.location.href = "/admin/language/list"));
    };
    $scope.changeData = function (selected) {
      if (selected) {
        $scope.viewmodel.specificulture = selected.specificulture;
        $scope.viewmodel.displayName = selected.fullName;
        $scope.viewmodel.icon = selected.icon;
      }
    };
  },
]);
