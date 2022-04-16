modules.component("mediaFileUpload", {
  templateUrl:
    "/mix-app/views/app-portal/components/media-file-upload/view.html",
  bindings: {
    header: "=?",
    description: "=?",
    src: "=",
    srcUrl: "=",
    mediaFile: "=?",
    type: "=?",
    folder: "=?",
    auto: "=",
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
        ctrl.srcUrl = ctrl.srcUrl || image_placeholder;
        ctrl.mediaFile = ctrl.mediaFile || {};
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg|ico)/g);
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
          ctrl.mediaFile.fileFolder = ctrl.folder ? ctrl.folder : "Media";
          ctrl.mediaFile.title = ctrl.title ? ctrl.title : "";
          ctrl.mediaFile.description = ctrl.description ? ctrl.description : "";
          ctrl.mediaFile.fileName = ctrl.formFile.name.substring(
            0,
            ctrl.formFile.name.lastIndexOf(".")
          );
          ctrl.mediaFile.extension = ctrl.formFile.name.substring(
            ctrl.formFile.name.lastIndexOf(".")
          );
          if ($rootScope.isImage(ctrl.formFile)) {
            ctrl.canUpload = false;
            mediaService.openCroppie(files[0], ctrl, ctrl.autoSave);
          } else {
            ctrl.mediaFile.file = ctrl.formFile;
            ctrl.canUpload = true;
            if (ctrl.autoSave) {
              ctrl.uploadFile(ctrl.formFile);
            }
            // ctrl.getBase64(ctrl.formFile);
          }
        }
      };

      ctrl.croppieCallback = function (result) {
        if (result) {
          ctrl.isImage = true;
          if (!ctrl.autoSave) {
            ctrl.src = result;
            ctrl.mediaFile.fileStream = result;
          } else {
            ctrl.src = result.filePath;
          }
          $scope.$apply();
        } else if (ctrl.formFile) {
          if (ctrl.autoSave) {
            ctrl.uploadFile(ctrl.formFile);
          } else {
            ctrl.mediaFile.file = ctrl.formFile;
            ctrl.getBase64(ctrl.formFile);
          }
          //   ctrl.uploadFile(ctrl.formFile);
        }
      };

      ctrl.uploadFile = async function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          if (file) {
            var response = await mediaService.uploadMedia(
              file,
              ctrl.onUploadFileProgress
            );
            if (response.isSucceed) {
              ctrl.media = response.data;
              $rootScope.isBusy = false;
              ctrl.srcUrl = response.data.filePath;
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
            if (ctrl.mediaFile) {
              ctrl.mediaFile.fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.mediaFile.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              ctrl.mediaFile.fileStream = reader.result;
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
