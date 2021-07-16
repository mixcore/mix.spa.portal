app.component("mixDatabaseMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/mix-database/components/main/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.appSettings = $rootScope.appSettings;
      ctrl.generateName = function (type) {
        if (!ctrl.model.displayName) {
          return;
        }

        let prefix = type == "System" ? "sys_" : "";

        // Generate database name if it's new or didn't named
        if (
          !ctrl.model.id ||
          ctrl.model.systemName === null ||
          ctrl.model.systemName === ""
        ) {
          ctrl.model.systemName = `${prefix}${$rootScope.generateKeyword(
            ctrl.model.displayName,
            "_",
            true
          )}`;
        }
      };
    },
  ],
  bindings: {
    model: "=",
  },
});
