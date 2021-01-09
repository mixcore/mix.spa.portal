app.component("modalCroppie", {
  templateUrl: "/mix-app/views/app-portal/components/modal-croppie/view.html",
  bidings: {
    resolve: "<",
    close: "&",
    dismiss: "&",
  },
  controller: function () {
    var $ctrl = this;
    $ctrl.fileUrl = "test";
    $ctrl.$onInit = function () {
      $ctrl.file = $ctrl.resolve.file;
    };

    $ctrl.ok = function () {
      $ctrl.close({ $value: $ctrl.fileUrl });
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({ $value: "cancel" });
    };
  },
});
