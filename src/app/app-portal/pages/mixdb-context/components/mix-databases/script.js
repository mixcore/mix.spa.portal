app.component("mixdbContextDatabases", {
  bindings: {
    model: "=",
  },
  templateUrl:
    "/mix-app/views/app-portal/pages/mixdb-context/components/mix-databases/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabasePortalService",
    function ($rootScope, $scope, databaseService) {
      var ctrl = this;
      ctrl.request = $rootScope.getRequest();
      ctrl.$onInit = () => {
        ctrl.globalSettings = $rootScope.globalSettings;
        ctrl.isInRole = $rootScope.isInRole;
        ctrl.request.mixDatabaseContextId = ctrl.model.id;
        ctrl.loadDatabases();
      };
      ctrl.loadDatabases = async function () {
        if (ctrl.model.id) {
          var resp = await databaseService.getList(ctrl.request);
          if (resp && resp.success) {
            ctrl.data = resp.data;
            $scope.$apply();
          }
        }
      };
    },
  ],
});
