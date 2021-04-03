app.component("moduleType", {
  templateUrl:
    "/mix-app/views/app-portal/pages/module/components/module-type/view.html",
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
