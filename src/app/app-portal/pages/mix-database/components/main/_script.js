app.component("mixDatabaseMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/mix-database/components/main/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.settings = $rootScope.globalSettings;
      ctrl.gennerateName = function () {
        if (
          !ctrl.model.id ||
          ctrl.model.name === null ||
          ctrl.model.name === ""
        ) {
          ctrl.model.name = $rootScope.generateKeyword(ctrl.model.title, "_");
        }
      };
    },
  ],
  bindings: {
    model: "=",
  },
});
