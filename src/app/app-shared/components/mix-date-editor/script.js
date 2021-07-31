sharedComponents.component("mixDateEditor", {
  templateUrl: "/mix-app/views/app-shared/components/mix-date-editor/view.html",
  bindings: {
    utcDate: "=",
    isReadonly: "=?",
  },
  controller: [
    "$filter",
    function ($filter) {
      var ctrl = this;
      ctrl.$onInit = async function () {
        ctrl.readonly = ctrl.isReadonly === "true";
        if (ctrl.utcDate) {
          let local = $filter("utcToLocal")(ctrl.utcDate, "yyyy-MM-ddTHH:mm");
          ctrl.local = new Date(local);
        }
      };
      ctrl.update = function () {
        ctrl.utcDate = ctrl.local.toISOString();
      };
    },
  ],
});
