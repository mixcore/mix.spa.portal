sharedComponents.component("previewPopup", {
  templateUrl:
    "/mix-app/views/app-shared/components/preview-popup/preview-popup.html",
  controller: [
    "$location",
    function ($location) {
      var ctrl = this;
      ctrl.goToLink = async function (link) {
        $("#dlg-preview-popup").modal("hide");
        $location.path(link);
      };
    },
  ],
  bindings: {
    previewObject: "=",
  },
});
