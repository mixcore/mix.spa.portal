modules.component("moduleFormEditor", {
  templateUrl: "/app/app-shared/components/module-form-editor/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      this.dataTypes = ngAppSettings.dataTypes;
      ctrl.$onInit = function () {
        if (!ctrl.datatype) {
          ctrl.datatype = ctrl.data.dataType;
        }
      };
    },
  ],
  bindings: {
    data: "=",
    datatype: "=?",
    inputClass: "=",
    isShowTitle: "=",
    fieldTitle: "=",
  },
});
