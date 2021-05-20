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
      ctrl.init = function () {
        var routes = JSON.parse($("#portal-menus").val());
        ctrl.items = routes.data;
      };
    },
  ],
  bindings: {},
});
