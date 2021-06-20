app.component("appSettingsHeart", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/heart/view.html",
  bindings: {
    appSettings: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "CommonService",
    "ngAppSettings",
    function ($rootScope, $scope, commonService, ngAppSettings) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.databaseProviders = ngAppSettings.enums.database_providers;
        ctrl.cacheModes = ngAppSettings.enums.cache_modes;
      };
      ctrl.clearCache = async function () {
        $rootScope.isBusy = true;
        await commonService.clearCache();
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      };
    },
  ],
});
