﻿app.component("moduleContent", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/module-content/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.backUrl = `/admin/module/details`;
      };
      ctrl.mixConfigurations = $rootScope.globalSettings;
    },
  ],
});
