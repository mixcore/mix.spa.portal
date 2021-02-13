modules.component("mixFieldPreview", {
  templateUrl: "/mix-app/views/app-shared/components/mix-field-preview/view.html",
  bindings: {
    model: "=",
    field: "=",
    isShowTitle: "=?",
    inputClass: "=?",
  },
  controller: [
    "$rootScope",
    "$sce",
    function ($rootScope, $sce) {
      var ctrl = this;
      ctrl.previousId = null;
      ctrl.$onInit = function () {
        ctrl.uuid = $rootScope.generateUUID();
        if (ctrl.field.isEncrypt) {
          var obj = $rootScope.testJSON(ctrl.model);
          if (obj) {
            ctrl.encryptedData = obj;
            ctrl.model = ctrl.encryptedData.data;
            ctrl.decrypted = $rootScope.decrypt(ctrl.encryptedData);
          }
        }
        if (ctrl.field.dataType == 20 && ctrl.model) {
          // youtube video
          ctrl.model = $sce.trustAsResourceUrl(
            "https://www.youtube.com/embed/" +
            ctrl.model +
            "?rel=0&showinfo=0&autoplay=0"
          );
        }
        // if(ctrl.field.dataType == 24 && ctrl.model) // youtube video
        // {
        //     ctrl.generateQRCode();
        // }
      };

      ctrl.generateQRCode = function () {
        setTimeout(() => {
          $("#" + ctrl.uuid).empty();
          $("#" + ctrl.uuid).qrcode(ctrl.model);
        }, 200);
      };
    },
  ],
});
