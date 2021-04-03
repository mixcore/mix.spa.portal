modules.component("mixFileUpload", {
  templateUrl: "/mix-app/views/app-portal/components/mix-file-upload/view.html",
  bindings: {
    w: "=?",
    h: "=?",
    rto: "=?",
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
      ctrl.isAdmin = $rootScope.isAdmin;
      ctrl.mediaNavs = [];
      ctrl.$onInit = function () {
        ctrl.id = Math.floor(Math.random() * 100);
      };
      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          const file = files[0];
          ctrl.mediaFile.folder = ctrl.folder ? ctrl.folder : "Media";
          ctrl.mediaFile.title = ctrl.title ? ctrl.title : "";
          ctrl.mediaFile.description = ctrl.description ? ctrl.description : "";
          ctrl.mediaFile.file = file;
          if (ctrl.w || ctrl.h || ctrl.rto) {
            ctrl.openCroppie(file);
          } else {
            if (ctrl.auto == "true") {
              ctrl.uploadFile(file);
            } else {
              ctrl.getBase64(file);
            }
          }
        }
      };

      ctrl.getBase64 = function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          // ctrl.cropped.source = null;
          reader.onload = function () {
            if (ctrl.media.mediaFile) {
              ctrl.media.mediaFile.fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              ctrl.media.mediaFile.extension = file.name.substring(
                file.name.lastIndexOf(".")
              );
              // ctrl.postedFile.fileStream = reader.result;
            }
            var image = new Image();
            image.src = reader.result;

            image.onload = function () {
              // access image size here
              ctrl.w = ctrl.w || this.width;
              ctrl.h = ctrl.h || this.height;
              ctrl.loadImageSize(this.width, this.height);
              ctrl.cropped.source = reader.result;
              $rootScope.isBusy = false;
              $scope.$apply();
            };
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
          if (response.isSucceed) {
            if (ctrl.onSuccess) {
              ctrl.onSuccess();
            }
            $rootScope.showMessage("success", "success");
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showErrors(response.errors);
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          $rootScope.showErrors(["Please choose file"]);
        }
      };

      ctrl.openCroppie = function (file) {
        const w = parseInt(ctrl.w);
        const h = parseInt(ctrl.h);
        const rto = ctrl.w / ctrl.h;

        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: "show",
          templateUrl:
            "/mix-app/views/app-shared/components/modal-croppie/croppie.html",
          controller: "ModalCroppieController",
          controllerAs: "$ctrl",
          size: "lg",
          resolve: {
            mediaService: mediaService,
            file: function () {
              return file;
            },
            w,
            h,
            rto,
          },
        });

        modalInstance.result.then(
          function (result) {
            ctrl.srcUrl = result.fullPath;
          },
          function () {}
        );
      };

      ctrl.isImage = function (filename) {
        filename
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
      };
    },
  ],
});
