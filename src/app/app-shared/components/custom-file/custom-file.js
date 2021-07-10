﻿//sharedComponents.controller('ImageController', );
sharedComponents.component("customFile", {
  templateUrl:
    "/mix-app/views/app-shared/components/custom-file/custom-file.html",
  bindings: {
    header: "=",
    title: "=",
    description: "=",
    src: "=",
    srcUrl: "=",
    data: "=",
    type: "=",
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
      ctrl.init = function () {
        ctrl.id = Math.random();
      };
      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          const file = files[0];
          if ($rootScope.isImage(file)) {
            ctrl.canUpload = false;
            mediaService.openCroppie(file, ctrl, true);
          } else {
            ctrl.canUpload = true;
            ctrl.getBase64(file);
          }
        }
      };

      ctrl.croppieCallback = function (result) {
        ctrl.srcUrl = result.filePath;
        if (ctrl.onInsert) {
          ctrl.onInsert({ data: ctrl.srcUrl });
        }
      };

      ctrl.uploadFile = async function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async function () {
            var getMedia = await mediaService.getSingle(["portal"]);
            if (getMedia.success) {
              ctrl.data.mediaFile.fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.data.mediaFile.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              ctrl.data.mediaFile.fileStream = reader.result;
              var media = getMedia.data;
              media.data.mediaFile = ctrl.data.mediaFile;
              var resp = await mediaService.save(media);
              if (resp && resp.success) {
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
        if (file !== null && ctrl.data.mediaFile) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            var index = reader.result.indexOf(",") + 1;
            var base64 = reader.result.substring(index);
            ctrl.data.mediaFile.fileName = file.name.substring(
              0,
              file.name.lastIndexOf(".")
            );
            ctrl.data.mediaFile.extension = file.name.substring(
              file.name.lastIndexOf(".")
            );
            ctrl.data.mediaFile.fileStream = reader.result;
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
