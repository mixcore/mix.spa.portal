﻿app.component("appSettingsGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/general/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "AppSettingsServices",
    "CommonService",
    function ($rootScope, $scope, settingService, commonService) {
      var ctrl = this;
      ctrl.stopApplication = async function () {
        $rootScope.isBusy = true;
        await commonService.stopApplication();
        $rootScope.showMessage("success", "success");
        $rootScope.isBusy = false;
        $scope.$apply();
      };
    },
  ],
  bindings: {
    appSettings: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
