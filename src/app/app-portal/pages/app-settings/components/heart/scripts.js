app.component("appSettingsHeart", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/heart/view.html",
  bindings: {},
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "AppSettingsServices",
    "CommonService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      settingService,
      commonService
    ) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.databaseProviders = ngAppSettings.enums.database_providers;
        ctrl.cacheModes = ngAppSettings.enums.cache_modes;
        settingService.getAppSettings("mix_heart").then((resp) => {
          ctrl.appSettings = resp.data;
          $scope.$apply;
        });
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
