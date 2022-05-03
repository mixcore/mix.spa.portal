sharedComponents.component("previewPopup", {
  templateUrl:
    "/mix-app/views/app-shared/components/preview-popup/preview-popup.html",
  controller: [
    "$scope",
    "$location",
    function ($scope, $location) {
      var ctrl = this;
      ctrl.$onInit = function () {
        $("#dlg-preview-popup").on("hidden.bs.modal", function (e) {
          ctrl.previewObject.data = null;
          $scope.$apply();
        });
      };
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
