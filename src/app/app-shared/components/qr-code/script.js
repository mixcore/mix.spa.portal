sharedComponents.component("qrCode", {
  templateUrl: "/mix-app/views/app-shared/components/qr-code/view.html",
  controller: [
    "$element",
    function ($element) {
      var ctrl = this;

      ctrl.$onInit = function () {
        setTimeout(() => {
          if (ctrl.model) {
            ctrl.generate();
          }
        }, 200);
      };
      ctrl.initOutput = function () {
        ctrl.element = $element[0].querySelector(".qr-output");
        ctrl.generate();
      };
      ctrl.generate = function () {
        $(ctrl.element).empty();
        $(ctrl.element).qrcode(ctrl.model);
      };
    },
  ],
  bindings: {
    model: "=",
    viewOnly: "=?",
  },
});
