app.component("appSettingsSmtp", {
  templateUrl:
    "/mix-app/views/app-portal/pages/app-settings/components/smtp/view.html",
  controller: [
    "ngAppSettings",
    function (ngAppSettings) {
      var ctrl = this;
    },
  ],
  bindings: {
    appSettings: "=",
  },
});
