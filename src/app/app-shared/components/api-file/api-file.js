﻿sharedComponents.component("apiFile", {
  templateUrl: "/mix-app/views/app-shared/components/api-file/api-file.html",
  controller: [
    "$rootScope",
    "$scope",
    "Upload",
    function PortalTemplateController($rootScope, $scope, uploader) {
      var ctrl = this;
      ctrl.accept = ctrl.accept || "application/zip";
      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          const file = files[0];
          ctrl.postedFile = file;
        }
      };

      ctrl.uploadFile = function (file) {
        // Create FormData object
        var files = new FormData();
        var folder = ctrl.folder;
        var title = ctrl.title;
        var description = ctrl.description;
        // Looping over all files and add it to FormData object
        files.append(file.name, file);

        // Adding one more key to FormData object
        files.append("fileFolder", folder);
        files.append("title", title);
        files.append("description", description);
        $.ajax({
          url: "/" + $rootScope.mixConfigurations.lang + "/media/upload", //'/tts/UploadImage',
          type: "POST",
          contentType: false, // Not to set any content header
          processData: false, // Not to process data
          data: files,
          success: function (result) {
            ctrl.src = result.data.fullPath;
            $scope.$apply();
          },
          error: function (err) {
            return "";
          },
        });
      };
      ctrl.getBase64 = function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            var index = reader.result.indexOf(",") + 1;
            var base64 = reader.result.substring(index);
            ctrl.postedFile.fileName = file.name.substring(
              0,
              file.name.lastIndexOf(".")
            );
            ctrl.postedFile.extension = file.name.substring(
              file.name.lastIndexOf(".")
            );
            ctrl.postedFile.fileStream = reader.result;
            $rootScope.isBusy = false;
            $scope.$apply();
          };
          reader.onerror = function (error) {};
        } else {
          return null;
        }
      };
    },
  ],
  bindings: {
    header: "=",
    accept: "=",
    title: "=",
    postedFile: "=",
    formName: "=",
    isBase64: "=",
  },
});
