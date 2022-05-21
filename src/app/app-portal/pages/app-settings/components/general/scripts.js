app.component("appSettingsGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/general/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "CryptoService",
    "CommonService",
    function ($rootScope, $scope, cryptoService, commonService) {
      var ctrl = this;
      ctrl.$onInit = () => {
        var key = cryptoService.parseKeys(ctrl.appSettings.ApiEncryptKey);
        ctrl.apiKey = key.key;
        ctrl.iv = key.iv;
      };
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
