app.component("mixDatabaseMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/mix-database/components/main/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;

      ctrl.$onInit = () => {
        ctrl.globalSettings = $rootScope.globalSettings;
        ctrl.isInRole = $rootScope.isInRole;
      };
      ctrl.gennerateName = function (type) {
        if (
          !ctrl.model.id ||
          ctrl.model.systemName === null ||
          ctrl.model.systemName === ""
        ) {
          let prefix = ctrl.model.type == "System" ? "sys" : "";
          ctrl.model.systemName = $rootScope.generateKeyword(
            `${prefix} ${ctrl.model.displayName}`,
            "",
            true,
            true
          );
          if (ctrl.schema) {
            ctrl.model.systemName = `${ctrl.schema}_${ctrl.model.systemName}`;
          }
        }
      };
    },
  ],
  bindings: {
    model: "=",
    schema: "=?",
  },
});
