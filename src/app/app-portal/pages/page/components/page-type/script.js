app.component("pageType", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/page-type/view.html",
  bindings: {
    model: "=",
  },
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.localizeSettings = $rootScope.globalSettings;
    },
  ],
});
