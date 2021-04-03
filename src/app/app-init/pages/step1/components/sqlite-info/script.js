modules.component("sqliteInfo", {
  templateUrl:
    "/mix-app/views/app-init/pages/step1/components/sqlite-info/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
    },
  ],
  bindings: {
    initCmsModel: "=",
  },
});
