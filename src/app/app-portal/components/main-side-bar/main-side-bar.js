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
        var resp = await apiService.getPortalMenus();
        if (resp.success && resp.data && resp.data.length) {
          ctrl.items = resp.data;
        } else {
          ctrl.items = JSON.parse($("#portal-menus").val()).items;
        }
      };
    },
  ],
  bindings: {
    items: "=?",
  },
});
