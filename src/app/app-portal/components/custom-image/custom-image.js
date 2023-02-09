modules.component("customImage", {
  templateUrl:
    "/mix-app/views/app-portal/components/custom-image/custom-image.html",
  bindings: {
    header: "=?",
    description: "=?",
    src: "=",
    srcUrl: "=",
    w: "=?",
    h: "=?",
    rto: "=?",
    postedFile: "=?",
    type: "=?",
    folder: "=?",
    auto: "=",
    onDelete: "&?",
    onUpdate: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$uibModal",
    "ngAppSettings",
    "MediaService",
    function ($rootScope, $scope, $uibModal, ngAppSettings, mediaService) {
      var ctrl = this;
      ctrl.isAdmin = $rootScope.isAdmin;
      var image_placeholder = "/mix-app/assets/img/image_placeholder.jpg";
      ctrl.isImage = false;
      ctrl.croppedStream = null;
      ctrl.mediaNavs = [];
      ctrl.options = {};
      ctrl.$onInit = function () {
        if (ctrl.src) {
          ctrl.srcUrl = angular.copy(ctrl.src);
        }
        if (!ctrl.srcUrl) {
          ctrl.srcUrl = image_placeholder;
        }
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg|webp)/g);
        ctrl.id = Math.floor(Math.random() * 100);
      };
      ctrl.calImageSize = function () {
        if (ctrl.w) {
          ctrl.h = ctrl.h || ctrl.w / ctrl.rto;
          ctrl.rto = ctrl.rto || ctrl.w / ctrl.h;
        }
        if (ctrl.h) {
          ctrl.w = ctrl.w || ctrl.h * ctrl.rto;
          ctrl.rto = ctrl.rto || ctrl.w / ctrl.h;
        }

        ctrl.maxHeight = ctrl.maxHeight || "200px";
        ctrl.options = {
          boundary: { width: 150 * ctrl.rto, height: 150 },
          render: { width: 1000 * ctrl.rto, height: 1000 },
          output: { width: ctrl.w, height: ctrl.h },
        };
      };

      ctrl.mediaFile = {
        file: null,
        fullPath: "",
        folder: ctrl.folder,
        title: ctrl.title,
        description: ctrl.description,
      };

      ctrl.croppieCallback = function (result) {
        if (result) {
          ctrl.srcUrl = result;
        } else if (ctrl.file) {
          ctrl.uploadFile(ctrl.file);
        }
      };

      ctrl.media = {};
      ctrl.$doCheck = function () {
        if (ctrl.src !== ctrl.srcUrl && ctrl.srcUrl != image_placeholder) {
          ctrl.src = ctrl.srcUrl;
          ctrl.isImage = ctrl.srcUrl
            .toLowerCase()
            .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
        }
      }.bind(ctrl);

      ctrl.selectFile = function (files) {
        debugger;
        if (files !== undefined && files !== null && files.length > 0) {
          ctrl.file = files[0];
          ctrl.mediaFile.fileFolder = ctrl.folder || "Media";
          ctrl.mediaFile.title = ctrl.title || "";
          ctrl.mediaFile.description = ctrl.description || "";
          ctrl.mediaFile.file = ctrl.file;
          mediaService.openCroppie(ctrl.file, ctrl, true);
        }
      };

      ctrl.uploadFile = async function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var resp = await mediaService.uploadMedia(file);
          if (resp && resp.success) {
            ctrl.src = resp.data;
            ctrl.srcUrl = resp.data;
            ctrl.isImage = ctrl.srcUrl
              .toLowerCase()
              .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          return null;
        }
      };

      ctrl.getBase64 = function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            var index = reader.result.indexOf(",") + 1;
            var base64 = reader.result.substring(index);
            if (ctrl.postedFile) {
              ctrl.postedFile.fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.postedFile.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              ctrl.postedFile.fileStream = reader.result;
            }
            ctrl.srcUrl = reader.result;
            ctrl.isImage =
              ctrl.srcUrl.indexOf("data:image/") >= 0 ||
              ctrl.srcUrl
                .toLowerCase()
                .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
            ctrl.src = reader.result;
            $rootScope.isBusy = false;
            $scope.$apply();
          };
          reader.onerror = function (error) {
            $rootScope.isBusy = false;
            $rootScope.showErrors([error]);
          };
        } else {
          return null;
        }
      };

      ctrl.onUploadFileProgress = function (progress) {
        ctrl.progress = progress;
      };
    },
  ],
});
