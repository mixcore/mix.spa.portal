modules.component("portalThemeSettings", {
  templateUrl:
    "/mix-app/views/app-portal/components/portal-theme-settings/view.html",
  bindings: {
    showLink: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "AppSettingsServices",
    function ($rootScope, $scope, appSettingsServices) {
      var ctrl = this;
      this.$onInit = function () {
        ctrl.portalThemeSettings = $rootScope.appSettings.portalThemeSettings;
      };
      ctrl.applyThemeSettings = function () {
        $rootScope.appSettings.portalThemeSettings = ctrl.portalThemeSettings;
      };
      ctrl.saveThemeSettings = async function () {
        var resp = await appSettingsServices.saveAppSettings(
          "PortalThemeSettings",
          ctrl.portalThemeSettings
        );
        if (resp && resp.success) {
          $rootScope.showMessage("success", "success");
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $scope.$apply();
        }
      };
    },
  ],
});
