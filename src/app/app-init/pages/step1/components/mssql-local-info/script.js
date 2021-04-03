modules.component("mssqlLocalInfo", {
  templateUrl:
    "/mix-app/views/app-init/pages/step1/components/mssql-local-info/view.html",
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
