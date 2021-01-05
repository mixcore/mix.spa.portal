﻿modules.controller("ModalCroppieController", function (
  $rootScope,
  $scope,
  $http,
  $uibModalInstance,
  mediaService,
  file,
  w,
  h,
  rto
) {
  var ctrl = this;
  ctrl.file = file;
  ctrl.w = w;
  ctrl.h = h;
  ctrl.rto = rto;
  ctrl.isAdmin = $rootScope.isAdmin;
  ctrl.postedFile = {};
  ctrl.isImage = false;
  ctrl.mediaNavs = [];
  ctrl.media = {
    title: "",
    mediaFile: {
      file: null,
    },
  };
  ctrl.image_placeholder = "/assets/img/image_placeholder.jpg";
  ctrl.options = null;
  // `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
  ctrl.init = function () {
    ctrl.srcUrl = ctrl.srcUrl || ctrl.image_placeholder;
    ctrl.maxHeight = ctrl.maxHeight || "2000px";
    ctrl.id = Math.floor(Math.random() * 100);
    ctrl.canvas = document.getElementById(`canvas-${ctrl.id}`);
    ctrl.cropped = {
      source: null,
    };
    // var frameUrl = '/content/templates/tsets/uploads/2019-10/730149275529721421464195891692074859757568n0037047f8f6f4adab55211aee3538155.png';//$rootScope.settings.data['frame_url']
    if (ctrl.frameUrl) {
      ctrl.frame = ctrl.loadImage(frameUrl);
    }

    if (ctrl.srcUrl) {
      ctrl.loadBase64(ctrl.srcUrl);
    }

    if (ctrl.file) {
      setTimeout(() => {
        ctrl.selectFile([ctrl.file]);
      }, 500);
    }

    // Assign blob to component when selecting a image
  };

  ctrl.loadFromUrl = function () {
    if (ctrl.src !== ctrl.srcUrl && ctrl.srcUrl != ctrl.image_placeholder) {
      ctrl.src = ctrl.srcUrl;
      ctrl.isImage = ctrl.srcUrl
        .toLowerCase()
        .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
      if (ctrl.isImage) {
        ctrl.loadBase64(ctrl.srcUrl);
      }
    }
  };

  ctrl.ok = async function () {
    ctrl.media.mediaFile.fileStream = ctrl.cropped.image;
    var result = await mediaService.save(ctrl.media);
    if (result.isSucceed) {
      $uibModalInstance.close(result.data);
    }
  };

  ctrl.cancel = function () {
    $uibModalInstance.dismiss("cancel");
  };
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
  ctrl._arrayBufferToBase64 = function (buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  ctrl.selectFile = function (files) {
    if (files !== undefined && files !== null && files.length > 0) {
      const file = files[0];
      ctrl.media.folder = ctrl.folder ? ctrl.folder : "Media";
      ctrl.media.title = ctrl.title ? ctrl.title : file.name;
      ctrl.media.description = ctrl.description ? ctrl.description : "";
      ctrl.media.mediaFile.fileName = file.name.substring(
        0,
        file.name.lastIndexOf(".")
      );
      ctrl.media.mediaFile.extension = file.name.substring(
        file.name.lastIndexOf(".")
      );
      ctrl.getBase64(file);
      // if (file.size < 100000) {
      //   var msg = "Please choose a better photo (larger than 100kb)!";
      //   $rootScope.showConfirm(ctrl, null, [], null, null, msg);
      // } else {
      // }
    }
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
        ctrl.cropped.source = base64;
        $scope.$apply();
      };
      return base64;
    });
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
  ctrl.loadImageSize = function (w, h) {
    const maxW = 250;
    var rto = w / h;
    ctrl.w = ctrl.w || w;
    ctrl.h = ctrl.h || h;
    ctrl.rto = ctrl.rto || rto;
    ctrl.options = {
      boundary: { height: maxW / rto, width: maxW },
      render: { height: maxW / rto, width: maxW },
      output: { height: ctrl.h, width: ctrl.h * ctrl.rto },
    };
    ctrl.loadViewport();
    // ctrl.image_placeholder = `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
  };
  ctrl.loadViewport = function () {
    if (ctrl.w && ctrl.h) {
      ctrl.rto = ctrl.w / ctrl.h;
      let h = ctrl.h * 0.6;
      let w = h * ctrl.rto;
      if (w > ctrl.options.boundary.width) {
        w = ctrl.options.boundary.width;
        h = w / ctrl.rto;
      }
      ctrl.options.viewport = {
        height: h,
        width: w,
      };
    }
    // ctrl.image_placeholder = "/assets/img/image_placeholder.jpg"; // `https://via.placeholder.com/${ctrl.options.render.width}x${ctrl.options.render.height}.png`;
  };
});
