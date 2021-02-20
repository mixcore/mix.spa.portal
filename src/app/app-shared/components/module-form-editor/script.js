modules.component("moduleFormEditor", {
  templateUrl: "/mix-app/views/app-shared/components/module-form-editor/view.html",
  bindings: {
    data: "=",
    datatype: "=?",
    inputClass: "=",
    isShowTitle: "=",
    fieldTitle: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      this.dataTypes = ngAppSettings.dataTypes;
      ctrl.$onInit = function () {
        ctrl.dataType = ctrl.data.dataType.toLowerCase() || ctrl.dataType.toLowerCase();
      };
    },
  ],
});
