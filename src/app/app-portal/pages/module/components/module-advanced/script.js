app.component("moduleAdvanced", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/module-advanced/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = function () {
        ctrl.isAdmin = $rootScope.isAdmin;
      };
    },
  ],
});
