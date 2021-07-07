modules.component("mediaFileUpload", {
  templateUrl:
    "/mix-app/views/app-portal/components/media-file-upload/view.html",
  bindings: {
    header: "=?",
    description: "=?",
    src: "=",
    srcUrl: "=",
    mediaFile: "=?",
    formFile: "=",
    type: "=?",
    folder: "=?",
    auto: "=",
    acceptTypes: "=?",
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
        ctrl.srcUrl = ctrl.srcUrl || image_placeholder;
        ctrl.mediaFile = ctrl.mediaFile || {};
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
        ctrl.maxHeight = ctrl.maxHeight || "200px";
        ctrl.id = Math.floor(Math.random() * 100);
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
          const file = files[0];
          ctrl.mediaFile.fileFolder = ctrl.folder ? ctrl.folder : "Media";
          ctrl.mediaFile.title = ctrl.title ? ctrl.title : "";
          ctrl.mediaFile.description = ctrl.description ? ctrl.description : "";
          ctrl.mediaFile.fileName = file.name.substring(
            0,
            file.name.lastIndexOf(".")
          );
          ctrl.mediaFile.extension = file.name.substring(
            file.name.lastIndexOf(".")
          );
          if ($rootScope.isImage(file)) {
            ctrl.canUpload = false;
            mediaService.openCroppie(file, ctrl, false);
          } else {
            ctrl.mediaFile.file = file;
            ctrl.formFile = file;
            ctrl.canUpload = true;
            ctrl.getBase64(file);
          }
        }
      };

      ctrl.croppieCallback = function (result) {
        ctrl.isImage = true;
        ctrl.mediaFile.fileStream = result;
        ctrl.src = result;
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
