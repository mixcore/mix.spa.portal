modules.component("customImage", {
  templateUrl: "/app/app-portal/components/custom-image/custom-image.html",
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
      var image_placeholder = "/assets/img/image_placeholder.jpg";
      ctrl.isImage = false;
      ctrl.croppedStream = null;
      ctrl.mediaNavs = [];
      ctrl.options = {};
      ctrl.$onInit = function () {
        ctrl.srcUrl = ctrl.srcUrl || image_placeholder;
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
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
      ctrl.openCroppie = function (file) {
        const w = parseInt(ctrl.w);
        const h = parseInt(ctrl.h);
        const rto = ctrl.w / ctrl.h;

        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: "show",
          templateUrl: "/app/app-portal/components/custom-image/croppie.html",
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

      ctrl.mediaFile = {
        file: null,
        fullPath: "",
        folder: ctrl.folder,
        title: ctrl.title,
        description: ctrl.description,
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

      ctrl.selectFile = function (file, errFiles) {
        if (file !== undefined && file !== null) {
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
              media.title = ctrl.title;
              media.description = ctrl.description;
              media.mediaFile = ctrl.mediaFile;
              var resp = await mediaService.save(media);
              if (resp && resp.isSucceed) {
                ctrl.src = resp.data.fullPath;
                ctrl.srcUrl = resp.data.fullPath;
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
            }
          };
          reader.onerror = function (error) {};
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
    },
  ],
});
