//sharedComponents.controller('ImageController', );
sharedComponents.component("customFile", {
  templateUrl:
    "/mix-app/views/app-shared/components/custom-file/custom-file.html",
  bindings: {
    header: "=",
    title: "=",
    description: "=",
    src: "=",
    srcUrl: "=?",
    data: "=?",
    type: "=?",
    folder: "=",
    auto: "=",
    onInsert: "&?",
    onDelete: "&",
    save: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "MediaService",
    function PortalTemplateController($rootScope, $scope, mediaService) {
      var ctrl = this;
      ctrl.media = null;
      ctrl.$onInit = function () {
        ctrl.id = Math.random();
        ctrl.mediaFile = {
          file: null,
          fullPath: "",
          fileFolder: "content/site",
          title: "",
          description: "",
        };
      };
      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          ctrl.file = files[0];
          if ($rootScope.isImage(ctrl.file)) {
            ctrl.canUpload = false;
            mediaService.openCroppie(ctrl.file, ctrl, true);
          } else {
            ctrl.canUpload = true;
            ctrl.uploadFile(ctrl.file);
          }
        }
      };

      ctrl.croppieCallback = function (result) {
        if (result) {
          ctrl.srcUrl = result.filePath;
          if (ctrl.onInsert) {
            ctrl.onInsert({ data: ctrl.srcUrl });
          }
        } else if (ctrl.file) {
          ctrl.uploadFile(ctrl.file);
        }
      };

      ctrl.uploadFile = async function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async function () {
            var getMedia = await mediaService.getSingle(["portal"]);
            if (getMedia.isSucceed) {
              ctrl.mediaFile.fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.mediaFile.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              ctrl.mediaFile.fileStream = reader.result;
              var media = getMedia.data;
              media.mediaFile = ctrl.mediaFile;
              var resp = await mediaService.save(media);
              if (resp && resp.isSucceed) {
                ctrl.src = resp.data.fullPath;
                ctrl.srcUrl = resp.data.fullPath;
                $rootScope.isBusy = false;
                $scope.$apply();
              } else {
                if (resp) {
                  $rootScope.showErrors(resp.errors);
                }
                $rootScope.isBusy = false;
                $scope.$apply();
              }
            }
          };
          reader.onerror = function (error) {};
        } else {
          return null;
        }
      };
      ctrl.getBase64 = function (file) {
        if (file !== null && ctrl.mediaFile) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            var index = reader.result.indexOf(",") + 1;
            var base64 = reader.result.substring(index);
            ctrl.mediaFile.fileName = file.name.substring(
              0,
              file.name.lastIndexOf(".")
            );
            ctrl.mediaFile.extension = file.name.substring(
              file.name.lastIndexOf(".")
            );
            ctrl.mediaFile.fileStream = reader.result;
            ctrl.srcUrl = reader.result;
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
    },
  ],
});
