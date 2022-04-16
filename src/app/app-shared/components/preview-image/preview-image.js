sharedComponents.component("previewImage", {
  templateUrl:
    "/mix-app/views/app-shared/components/preview-image/preview-image.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.isImage = false;
      ctrl.init = function () {
        if (ctrl.imgSrc) {
          ctrl.imgClass = ctrl.imgClass || "rounded";
          ctrl.isImage = ctrl.imgSrc
            .toLowerCase()
            .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg|webp|jfif|ico)/g);
          // check if facebook avatar Url
          ctrl.isImage =
            ctrl.isImage ||
            ctrl.imgSrc
              .toLowerCase()
              .match(
                /(?:(?:http|https):\/\/)?(?:www.)?(graph.facebook.com)\/([A-Za-z0-9.]{0,})\/(picture)(\?)?([A-Za-z0-9.=&]{0,})?/g
              );
        }
      };
      ctrl.showImage = async function (functionName, args, context) {
        $rootScope.preview("img", ctrl.imgSrc);
      };
    },
  ],
  bindings: {
    imgWidth: "=",
    imgHeight: "=",
    imgSrc: "=",
    imgClass: "=?",
  },
});
