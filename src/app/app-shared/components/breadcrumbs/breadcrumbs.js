sharedComponents.component("breadcrumbs", {
  templateUrl:
    "/mix-app/views/app-shared/components/breadcrumbs/breadcrumbs.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
    },
  ],
  bindings: {
    breadCrumbs: "=",
  },
});
