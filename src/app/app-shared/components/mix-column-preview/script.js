sharedComponents.component("mixColumnPreview", {
  templateUrl:
    "/mix-app/views/app-shared/components/mix-column-preview/view.html",
  bindings: {
    model: "=",
    column: "=",
    maxLength: "=?",
    isShowTitle: "=?",
    inputClass: "=?",
  },
  controller: [
    "$rootScope",
    "$sce",
    "$filter",
    function ($rootScope, $sce, $filter) {
      var ctrl = this;
      ctrl.previousId = null;

      ctrl.$onInit = function () {
        ctrl.parseView();
      };
      ctrl.parseView = function () {
        ctrl.uuid = $rootScope.generateUUID();
        var obj = $rootScope.testJSON(ctrl.model);
        ctrl.view = ctrl.model;
        if (ctrl.column.isEncrypt) {
          if (obj) {
            ctrl.encryptedData = obj;
            ctrl.model = ctrl.encryptedData.data;
            ctrl.decrypted = $rootScope.decrypt(ctrl.encryptedData);
          }
        } else {
          if (obj && ctrl.maxLength) {
            ctrl.view = JSON.stringify(ctrl.model);
          }
        }
        if (ctrl.maxLength && ctrl.view) {
          ctrl.view = $filter("trim")(ctrl.view, ctrl.maxLength);
        }
        if (ctrl.column.dataType == 20 && ctrl.model) {
          // youtube video
          ctrl.model = $sce.trustAsResourceUrl(
            "https://www.youtube.com/embed/" +
              ctrl.model +
              "?rel=0&showinfo=0&autoplay=0"
          );
        }
        // if(ctrl.column.dataType == 24 && ctrl.model) // youtube video
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
