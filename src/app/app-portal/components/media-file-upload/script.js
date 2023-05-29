modules.component("mediaFileUpload", {
  templateUrl:
    "/mix-app/views/app-portal/components/media-file-upload/view.html",
  bindings: {
    header: "=?",
    accept: "=?",
    src: "=",
    srcUrl: "=",
    fileModel: "=?",
    type: "=?",
    auto: "=?",
    uploadOptions: "=?",
    onDelete: "&?",
    onUpdate: "&?",
    onInsert: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "MediaService",
    function ($rootScope, $scope, ngAppSettings, mediaService) {
      var ctrl = this;
      ctrl.isAdmin = $rootScope.isAdmin;
      var image_placeholder = "/mix-app/assets/img/image_placeholder.jpg";
      ctrl.isImage = false;
      ctrl.mediaNavs = [];
      ctrl.$onInit = function () {
        ctrl.autoSave = ctrl.auto === "true";
        if (ctrl.src) {
          ctrl.srcUrl = angular.copy(ctrl.src);
        }
        if (!ctrl.srcUrl) {
          ctrl.srcUrl = image_placeholder;
        }
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg|webp)/g);
        ctrl.maxHeight = ctrl.maxHeight || "200px";
        ctrl.id = Math.floor(Math.random() * 100);
        if (ctrl.uploadOptions) {
          ctrl.w = ctrl.uploadOptions.width;
          ctrl.h = ctrl.uploadOptions.height;
        }
      };
      ctrl.$doCheck = function () {
        if (ctrl.src !== ctrl.srcUrl && ctrl.srcUrl != image_placeholder) {
          ctrl.src = ctrl.srcUrl;
          ctrl.isImage = ctrl.srcUrl
            .toLowerCase()
            .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
        }
      }.bind(ctrl);

      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          ctrl.formFile = files[0];
          if (
            ctrl.uploadOptions &&
            ctrl.uploadOptions.isCrop &&
            $rootScope.isImage(ctrl.formFile)
          ) {
            ctrl.canUpload = false;
            mediaService.openCroppie(files[0], ctrl, ctrl.autoSave);
          } else {
            ctrl.canUpload = true;
            if (ctrl.autoSave) {
              ctrl.uploadFile(ctrl.formFile);
            } else {
              ctrl.getBase64(ctrl.formFile);
            }
          }
        }
      };

      ctrl.croppieCallback = function (result) {
        if (result) {
          ctrl.isImage = true;
          if (!ctrl.autoSave) {
            ctrl.src = result;
            ctrl.fileStream = result;
          } else {
            ctrl.src = result;
            ctrl.srcUrl = result;
          }
        } else if (ctrl.formFile) {
          if (ctrl.autoSave) {
            ctrl.uploadFile(ctrl.formFile);
          } else {
            ctrl.fileModel.file = ctrl.formFile;
            ctrl.getBase64(ctrl.formFile);
          }
          //   ctrl.uploadFile(ctrl.formFile);
        }
      };

      ctrl.uploadFile = async function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          if (file) {
            ctrl.srcUrl = null;
            var response = await mediaService.uploadMedia(
              file,
              null,
              ctrl.onUploadFileProgress
            );
            if (response.success) {
              ctrl.media = response.data;
              $rootScope.isBusy = false;
              ctrl.srcUrl = response.data;
              $scope.$apply();
            } else {
              $rootScope.showErrors(response.errors);
              $rootScope.isBusy = false;
              $scope.$apply();
            }
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
            debugger;
            if (ctrl.fileModel) {
              ctrl.fileModel.filename = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.fileModel.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              ctrl.fileModel.fileBase64 = reader.result;
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
