sharedComponents.component("moduleFormEditor", {
  templateUrl:
    "/mix-app/views/app-shared/components/module-form-editor/view.html",
  bindings: {
    data: "=",
    datatype: "=?",
    column: "=?",
    inputClass: "=",
    isShowTitle: "=",
    columnTitle: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$filter",
    "ngAppSettings",
    function ($rootScope, $scope, $filter, ngAppSettings) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      this.dataTypes = ngAppSettings.dataTypes;
      ctrl.$onInit = function () {
        ctrl.dataType =
          ctrl.data.dataType.toLowerCase() || ctrl.dataType.toLowerCase();
        switch (ctrl.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.data.value) {
              var local = $filter("utcToLocalTime")(ctrl.data.value);
              ctrl.data.value = new Date(local);
            }
            break;
          default:
            if (ctrl.column && !ctrl.data.value) {
              ctrl.data.value = ctrl.column.defaultValue;
            }
            break;
        }
      };
    },
  ],
});
