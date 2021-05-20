modules.component("mixFileUpload", {
  templateUrl: "/mix-app/views/app-portal/components/mix-file-upload/view.html",
  bindings: {
    folder: "=?",
    accept: "=?",
    onFail: "&?",
    onSuccess: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "FileServices",
    function ($rootScope, $scope, ngAppSettings, fileService) {
      var ctrl = this;
      ctrl.mediaFile = {};
      ctrl.isAdmin = $rootScope.isAdmin;
      ctrl.mediaNavs = [];
      ctrl.$onInit = function () {
        ctrl.id = Math.floor(Math.random() * 100);
      };
      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          const file = files[0];
          ctrl.file = file;
          ctrl.mediaFile.folder = ctrl.folder ? ctrl.folder : "Media";
          ctrl.mediaFile.title = ctrl.title ? ctrl.title : "";
          ctrl.mediaFile.description = ctrl.description ? ctrl.description : "";
          ctrl.mediaFile.file = file;
          if (ctrl.auto == "true") {
            ctrl.uploadFile(file);
          } else {
            ctrl.getBase64(file);
          }
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

      ctrl.uploadFile = async function () {
        if (ctrl.file) {
          $rootScope.isBusy = true;
          var response = await fileService.uploadFile(ctrl.file, ctrl.folder);
          if (response) {
            if (ctrl.onSuccess) {
              ctrl.onSuccess();
            }
            $rootScope.showMessage("success", "success");
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showErrors(['Cannot upload file']);
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          $rootScope.showErrors(["Please choose file"]);
        }
      };
    },
  ],
});
