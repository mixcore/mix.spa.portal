app.component("tenantGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/tenant/components/general/view.html",
  bindings: {
    model: "=",
    isAdmin: "=?",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "ngAppSettings",
    function ($rootScope, ngAppSettings) {
      var ctrl = this;
      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.$onInit = function () {};
      ctrl.generateName = function (isForce = false) {
        if (isForce || !ctrl.model.systemName) {
          ctrl.model.systemName = $rootScope.generateKeyword(
            ctrl.model.displayName,
            "_",
            true,
            true
          );
        }
      };
    },
  ],
});
