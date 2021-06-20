modules.component("mainSideBarDynamic", {
  templateUrl:
    "/mix-app/views/app-portal/components/main-side-bar-dynamic/main-side-bar-dynamic.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "CommonService",
    "TranslatorService",
    "AuthService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      commonService,
      translatorService,
      authService
    ) {
      var ctrl = this;
      ctrl.init = function () {
        commonService.getPermissions().then(function (response) {
          if (response && response.isSucceed) {
            ctrl.isInit = true;
            ctrl.roles = response.data;
            if (ctrl.roles.data) {
              ctrl.role = ctrl.roles.data[0];
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        });
      };
    },
  ],
  bindings: {
    roles: "=",
    activedRole: "=",
    translate: "&",
  },
});
