sharedComponents.component("barCode", {
  templateUrl: "/mix-app/views/app-shared/components/bar-code/view.html",
  bindings: {
    model: "=",
    viewOnly: "=?",
    encode: "=?", // allowed ean8 / ean13
  },
  controller: [
    "$element",
    function ($element) {
      var ctrl = this;

      ctrl.$onInit = function () {
        if (!ctrl.encode) {
          ctrl.encode = "ean8";
        }
        ctrl.maxLength = ctrl.encode == "ean8" ? 8 : 13;
        setTimeout(() => {
          if (ctrl.model) {
            ctrl.generate();
          }
        }, 200);
      };
      ctrl.initOutput = function () {
        ctrl.element = $element[0].querySelector(".bar-output");
        if (ctrl.model) {
          ctrl.generate();
        }
      };
      ctrl.generate = function () {
        $(ctrl.element).empty();
        $(ctrl.element).barcode(ctrl.model, ctrl.encode, {
          barWidth: 2,
          barHeight: 50,
        });
      };
    },
  ],
});
