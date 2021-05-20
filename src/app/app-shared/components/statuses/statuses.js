sharedComponents.component("statuses", {
  templateUrl: "/mix-app/views/app-shared/components/statuses/statuses.html",
  controller: [
    "$rootScope",
    "ngAppSettings",
    function ($rootScope, ngAppSettings) {
      this.contentStatuses = ngAppSettings.contentStatuses;
    },
  ],
  bindings: {
    status: "=",
  },
});
