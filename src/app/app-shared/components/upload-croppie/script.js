﻿sharedComponents.component("uploadCroppie", {
  templateUrl:
    "/mix-app/views/app-shared/components/upload-croppie/view.html?v=1",
  bindings: {
    header: "=",
    description: "=",
    src: "=",
    srcUrl: "=",
    h: "=?",
    w: "=?",
    isCrop: "=?",
    frameUrl: "=?",
    type: "=",
    folder: "=",
    auto: "=",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$modal",
    "$http",
    "ngAppSettings",
    function ($rootScope, $scope, $modal, $http, ngAppSettings) {
      var ctrl = this;
      ctrl.options = {
        boundary: { height: 250 },
        render: { width: 1000, height: 1000 },
        output: { width: 1000, height: 1000 },
      };
      ctrl.rto = 1;
      ctrl.isAdmin = $rootScope.isAdmin;
      ctrl.postedFile = {};
      ctrl.isImage = false;
      ctrl.mediaNavs = [];
      ctrl.image_placeholder = "/mix-app/assets/img/image_placeholder.jpg";
      // `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
      ctrl.$onInit = function () {
        ctrl.loadViewport();
        ctrl.srcUrl = ctrl.srcUrl || ctrl.image_placeholder;
        ctrl.isImage = ctrl.srcUrl
          .toLowerCase()
          .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
        ctrl.maxHeight = ctrl.maxHeight || "2000px";
        ctrl.id = Math.floor(Math.random() * 100);
        ctrl.canvas = document.getElementById(`canvas-${ctrl.id}`);
        ctrl.cropped = {
          source: ctrl.image_placeholder,
        };
        // var frameUrl = '/content/templates/tsets/uploads/2019-10/730149275529721421464195891692074859757568n0037047f8f6f4adab55211aee3538155.png';//$rootScope.mixConfigurations.data['frame_url']
        if (ctrl.frameUrl) {
          ctrl.frame = ctrl.loadImage(frameUrl);
        }
        if (ctrl.isImage) {
          ctrl.loadBase64(ctrl.srcUrl);
        }
        // Assign blob to component when selecting a image
      };
      ctrl.$doCheck = function () {
        if (ctrl.src !== ctrl.srcUrl && ctrl.srcUrl != ctrl.image_placeholder) {
          ctrl.src = ctrl.srcUrl;
          ctrl.isImage = ctrl.srcUrl
            .toLowerCase()
            .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
          if (ctrl.isImage) {
            ctrl.loadBase64(ctrl.srcUrl);
          }
        }
      }.bind(ctrl);
      ctrl.combineImage = function () {
        ctrl.canvas = document.getElementById(`canvas-${ctrl.id}`);
        if (ctrl.canvas) {
          var img = document.getElementById("croppie-src");
          var w = ctrl.options.boundary.width;
          var h = ctrl.options.boundary.height;
          // var rto = w / h;
          var newW = ctrl.options.output.width;
          var newH = ctrl.options.output.height;
          var ctx = ctrl.canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, newW, newH);
          if (ctrl.frame) {
            // combine with frame
            ctx.drawImage(ctrl.frame, 0, 0, w, h);
          }

          $scope.$apply(function () {
            ctrl.postedFile.fileStream = ctrl.canvas.toDataURL(); //ctx.getImageData(0, 0, 300, 350);
            ctrl.imgUrl = ctrl.postedFile.fileStream.replace(
              "image/png",
              "image/octet-stream"
            );
          });
        }
      };
      ctrl.saveCanvas = function () {
        var link = document.createElement("a");
        link.download = ctrl.postedFile.fileName + ctrl.postedFile.extension;
        $rootScope.isBusy = true;
        ctrl.canvas.toBlob(function (blob) {
          link.href = URL.createObjectURL(blob);
          link.click();
          $rootScope.isBusy = false;
          $scope.$apply();
        }, "image/png");
      };
      ctrl.loadBase64 = function (url) {
        var ext = url.substring(url.lastIndexOf(".") + 1);
        $http({
          method: "GET",
          url: url,
          responseType: "arraybuffer",
        }).then(function (resp) {
          var base64 = `data:image/${ext};base64,${ctrl._arrayBufferToBase64(
            resp.data
          )}`;
          var image = new Image();
          image.src = base64;
          image.onload = function () {
            // access image size here
            ctrl.loadImageSize(this.width, this.height);
          };
          ctrl.cropped.source = base64;
          return base64;
        });
      };
      ctrl.loadImage = function (src) {
        // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
        var img = new Image();
        // img.onload = onload;
        img.src = src;
        return img;
      };
      ctrl._arrayBufferToBase64 = function (buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };
      ctrl.mediaFile = {
        file: null,
        fullPath: "",
        folder: ctrl.folder,
        title: ctrl.title,
        description: ctrl.description,
      };
      ctrl.media = null;

      ctrl.selectFile = function (files) {
        if (files !== undefined && files !== null && files.length > 0) {
          const file = files[0];
          ctrl.mediaFile.folder = ctrl.folder ? ctrl.folder : "Media";
          ctrl.mediaFile.title = ctrl.title ? ctrl.title : "";
          ctrl.mediaFile.description = ctrl.description ? ctrl.description : "";
          ctrl.mediaFile.file = file;
          ctrl.getBase64(file);
          // if (file.size < 100000) {
          //   var msg = "Please choose a better photo (larger than 100kb)!";
          //   $rootScope.showConfirm(ctrl, null, [], null, null, msg);
          // } else {
          // }
        }
      };

      ctrl.getBase64 = function (file) {
        if (file !== null) {
          $rootScope.isBusy = true;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            ctrl.cropped.source = null;
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
              // ctrl.postedFile.fileStream = reader.result;
            }
            var image = new Image();
            image.src = reader.result;

            image.onload = function () {
              // access image size here
              ctrl.loadImageSize(this.width, this.height);
            };

            ctrl.cropped.source = reader.result;
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
      ctrl.loadImageSize = function (w, h) {
        var rto = w / h;
        // ctrl.options.boundary.width = ctrl.options.boundary.height * rto;
        ctrl.options.render.width = ctrl.options.render.height * rto;
        if (!ctrl.rto) {
          ctrl.rto = rto;
          ctrl.w = w;
          ctrl.h = h;
          ctrl.loadViewport();
        }
        $scope.$apply();
        ctrl.image_placeholder = `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
      };
      ctrl.loadViewport = function () {
        if (ctrl.w && ctrl.h) {
          ctrl.rto = ctrl.w / ctrl.h;
          ctrl.options.viewport.height = ctrl.h;
          ctrl.options.viewport.width = ctrl.options.viewport.height * ctrl.rto;
        }
        // ctrl.image_placeholder = "/mix-app/assets/img/image_placeholder.jpg"; // `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
      };
    },
  ],
});
