﻿app.component("moduleMain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/main/main.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.mixConfigurations = $rootScope.appSettings;
      ctrl.gennerateName = function () {
        if (
          !ctrl.module.id ||
          ctrl.module.name === null ||
          ctrl.module.name === ""
        ) {
          ctrl.module.name = $rootScope.generateKeyword(ctrl.module.title, "_");
        }
      };
    },
  ],
  bindings: {
    module: "=",
  },
});
