modules.component("mysqlInfo", {
  templateUrl:
    "/mix-app/views/app-init/pages/step1/components/mysql-info/view.html",
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
