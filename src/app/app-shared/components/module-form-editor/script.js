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
        ctrl.dataType = ctrl.datatype
          ? ctrl.datatype.toLowerCase()
          : ctrl.data.dataType.toLowerCase();
        switch (ctrl.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.data.value) {
              var local = $filter("utcToLocalTime")(ctrl.data.value);
              ctrl.data.value = new Date(local);
            }
            break;
          case "boolean":
            ctrl.data.value = String(ctrl.data.value) == "true";
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
