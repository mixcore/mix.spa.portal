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
        ctrl.obj = null;
        switch (ctrl.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.data.value) {
              ctrl.obj = new Date(ctrl.data.value);
            }
            break;
          case "boolean":
            ctrl.obj = String(ctrl.data.value) == "true";
            break;
          default:
            if (ctrl.column && !ctrl.data.value) {
              ctrl.data.value = ctrl.column.defaultValue;
              ctrl.obj = ctrl.column.defaultValue;
            }
            break;
        }
      };
      ctrl.updateValue = function () {
        switch (ctrl.dataType) {
          case "datetime":
            if (ctrl.obj) {
              ctrl.data.value = ctrl.obj.toLocaleString();
            }
            break;
          case "date":
            if (ctrl.obj) {
              ctrl.data.value = ctrl.obj.toLocaleDateString();
            }
            break;
          case "time":
            if (ctrl.obj) {
              ctrl.data.value = ctrl.obj.toLocaleTimeString("en-GB");
            }
            break;

          case "boolean":
            ctrl.data.value = ctrl.obj.toString().toLowerCase();
            break;
          default:
            ctrl.data.value = ctrl.obj;
            break;
        }
        console.log(ctrl.data.value);
      };
    },
  ],
});
