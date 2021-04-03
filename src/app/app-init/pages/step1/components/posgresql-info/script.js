modules.component("posgresqlInfo", {
  templateUrl:
    "/mix-app/views/app-init/pages/step1/components/posgresql-info/view.html",
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
