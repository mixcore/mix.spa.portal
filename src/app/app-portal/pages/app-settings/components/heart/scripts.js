app.component("appSettingsHeart", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/heart/view.html",
  bindings: {
    appSettings: "=",
  },
  controller: [
    "$rootScope",
    "ngAppSettings",
    function ($rootScope, ngAppSettings) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.databaseProviders = ngAppSettings.enums.database_providers;
        ctrl.cacheModes = ngAppSettings.enums.cache_modes;
      };
    },
  ],
});
