app.component("moduleAdvanced", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/module-advanced/view.html",
  bindings: {
    model: "=",
    addictionalData: "=",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.settings = $rootScope.globalSettings;
      ctrl.$onInit = function () {
        ctrl.isAdmin = $rootScope.isAdmin;
      };
    },
  ],
});
