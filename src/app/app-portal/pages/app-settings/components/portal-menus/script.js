modules.component("portalMenus", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/portal-menus/view.html",
  bindings: {
    data: "=",
    allowedTypes: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "ApiService",
    "CommonService",
    "ngAppSettings",
    function (
      $rootScope,
      $scope,
      $location,
      apiService,
      commonService,
      ngAppSettings
    ) {
      var ctrl = this;
      // ctrl.icons = [];
      ctrl.translate = $rootScope.translate;
      ctrl.init = function () {
        ctrl.icons = ngAppSettings.icons;
      };
    },
  ],
});
