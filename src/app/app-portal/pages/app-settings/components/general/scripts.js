app.component("appSettingsGeneral", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/general/view.html",
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
