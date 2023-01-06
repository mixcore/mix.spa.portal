modules.component("mainSideBar", {
  templateUrl:
    "/mix-app/views/app-portal/components/main-side-bar/main-side-bar.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "TranslatorService",
    "ApiService",
    "CommonService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      translatorService,
      apiService,
      commonService
    ) {
      var ctrl = this;
      ctrl.items = [];
      ctrl.init = async function () {
        ctrl.items = await apiService.getPortalMenus();
        if (!ctrl.items || !ctrl.items.length) {
          ctrl.items = JSON.parse($("#portal-menus").val()).items;
        }
      };
    },
  ],
  bindings: {
    items: "=?",
  },
});
