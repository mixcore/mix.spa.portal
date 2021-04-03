app.component("mixDatabaseEdm", {
  templateUrl:
    "/mix-app/views/app-portal/pages/mix-database/components/edm/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.localizeSettings = $rootScope.globalSettings;
    },
  ],
  bindings: {
    model: "=",
  },
});
