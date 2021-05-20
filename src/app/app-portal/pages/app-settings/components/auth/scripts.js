app.component("appSettingsAuth", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/auth/view.html",
  controller: [
    "ngAppSettings",
    function (ngAppSettings) {
      var ctrl = this;
    },
  ],
  bindings: {
    appSettings: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
