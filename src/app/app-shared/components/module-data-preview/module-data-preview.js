sharedComponents.component("moduleDataPreview", {
  templateUrl:
    "/mix-app/views/app-shared/components/module-data-preview/module-data-preview.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;

      ctrl.translate = $rootScope.translate;
      ctrl.$onInit = () => {
        if (!ctrl.datatype) {
          ctrl.datatype = ctrl.data.dataType;
        }
      };
    },
  ],
  bindings: {
    data: "=",
    datatype: "=?",
    width: "=",
    header: "=",
  },
});
