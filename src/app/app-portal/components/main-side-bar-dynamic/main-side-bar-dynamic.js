modules.component("mainSideBarDynamic", {
  templateUrl:
    "/mix-app/views/app-portal/components/main-side-bar-dynamic/main-side-bar-dynamic.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RoleService",
    "TranslatorService",
    "AuthService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      roleServices,
      translatorService,
      authService
    ) {
      var ctrl = this;
      ctrl.init = function () {
        roleServices.getPermissions().then(function (response) {
          if (response && response.isSucceed) {
            ctrl.isInit = true;
            ctrl.roles = response.data;
            if (ctrl.roles) {
              ctrl.role = ctrl.roles[0];
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
