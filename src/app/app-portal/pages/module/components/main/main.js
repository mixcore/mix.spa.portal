app.component("moduleMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/main/main.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.isInRole = $rootScope.isInRole;
      ctrl.gennerateName = function () {
        if (
          !ctrl.module.id ||
          ctrl.module.systemName === null ||
          ctrl.module.systemName === ""
        ) {
          ctrl.module.systemName = $rootScope.generateKeyword(
            ctrl.module.title,
            "_"
          );
        }
      };
    },
  ],
  bindings: {
    module: "=",
  },
});
