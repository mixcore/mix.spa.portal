sharedComponents.component("barCode", {
  templateUrl: "/mix-app/views/app-shared/components/bar-code/view.html",
  bindings: {
    model: "=",
    viewOnly: "=?",
    encode: "=?", // allowed ean8 / ean13
  },
  controller: [
    "$rootScope",
    "$element",
    function ($rootScope, $element) {
      var ctrl = this;
      ctrl.encodes = [
        "EAN8",
        "EAN13",
        "CODE128",
        "CODE128A",
        "CODE128B",
        "CODE128C",
        "UPC",
        "ITF14",
        "ITF",
        "MSI",
        "MSI10",
        "MSI11",
        "MSI1010",
        "MSI1110",
        "pharmacode",
      ];
      ctrl.$onInit = function () {
        if (!ctrl.encode) {
          ctrl.encode = "EAN8";
        }
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
        if (ctrl.element) {
          try {
            JsBarcode(ctrl.element, ctrl.model, { format: ctrl.encode });
            ctrl.error = null;
          } catch (error) {
            var context = ctrl.element.getContext("2d");
            // do some drawing
            context.clearRect(
              0,
              0,
              context.canvas.width,
              context.canvas.height
            );
            ctrl.element.width = context.canvas.width;
            ctrl.error = error;
          }
        }
        // $(ctrl.element).empty();
        // $(ctrl.element).barcode(ctrl.model, ctrl.encode, {
        //   barWidth: 2,
        //   barHeight: 50,
        // });
      };
      ctrl.download = function () {
        $rootScope.downloadCanvasImage(ctrl.element);
      };
    },
  ],
});
