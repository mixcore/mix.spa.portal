modules.component("mssqlInfo", {
  templateUrl:
    "/mix-app/views/app-init/pages/step1/components/mssql-info/view.html",
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
