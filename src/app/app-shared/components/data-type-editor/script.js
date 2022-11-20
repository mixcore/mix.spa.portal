sharedComponents.component("mixDataTypeEditor", {
  templateUrl:
    "/mix-app/views/app-shared/components/data-type-editor/view.html",
  bindings: {
    data: "=",
    dataType: "=",
    inputClass: "=?",
    isShowTitle: "=?",
    columnTitle: "=?",
  },
  controller: [
    "ngAppSettings",
    function (ngAppSettings) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      this.dataTypes = ngAppSettings.dataTypes;
      ctrl.$onInit = function () {
        ctrl.obj = null;
        switch (ctrl.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.data) {
              ctrl.obj = new Date(ctrl.data);
            }
            break;
          case "boolean":
            ctrl.obj = String(ctrl.data) == "true";
            break;
          default:
            if (ctrl.column && !ctrl.data) {
              ctrl.data = ctrl.column.defaultValue;
              ctrl.obj = ctrl.column.defaultValue;
            }
            break;
        }
      };
      ctrl.updateValue = function () {
        switch (ctrl.dataType) {
          case "datetime":
            if (ctrl.obj) {
              ctrl.data = ctrl.obj.toLocaleString();
            }
            break;
          case "date":
            if (ctrl.obj) {
              ctrl.data = ctrl.obj.toLocaleDateString();
            }
            break;
          case "time":
            if (ctrl.obj) {
              ctrl.data = ctrl.obj.toLocaleTimeString("en-GB");
            }
            break;

          case "boolean":
            ctrl.data = ctrl.obj.toString().toLowerCase();
            break;
          default:
            ctrl.data = ctrl.obj;
            break;
        }
        console.log(ctrl.data);
      };
    },
  ],
});
