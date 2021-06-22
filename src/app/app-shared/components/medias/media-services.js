"use strict";
appShared.factory("MediaService", [
  "$rootScope",
  "$uibModal",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, $uibModal, apiService, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("media");
    var _cloneMedia = async function (id) {
      var req = {
        method: "GET",
        url: serviceFactory.prefixUrl + "/clone/" + id,
      };
      return await apiService.getApiResult(req);
    };
    var _save = async function (objData, file, onUploadFileProgress) {
      var url = this.prefixUrl + "/save";
      var fd = new FormData();
      var file = objData.mediaFile.file;
      objData.mediaFile.file = null;
      fd.append("model", angular.toJson(objData));
      fd.append("file", file);
      return await serviceFactory.ajaxSubmitForm(fd, url, onUploadFileProgress);
    };
    var _uploadMedia = async function (file, onUploadFileProgress) {
      //var container = $(this).parents('.model-media').first().find('.custom-file').first();
      if (file !== null) {
        // Create FormData object
        var url = this.prefixUrl + "/upload-media";
        var fd = new FormData();

        fd.append("file", file);
        return await serviceFactory.ajaxSubmitForm(
          fd,
          url,
          onUploadFileProgress
        );
      }
    };
    var _openCroppie = function (file, scope, autoSave = true) {
      const w = parseInt(scope.w);
      const h = parseInt(scope.h);
      const rto = w && h ? scope.w / scope.h : null;

      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: "show",
        templateUrl:
          "/mix-app/views/app-shared/components/modal-croppie/croppie.html",
        controller: "ModalCroppieController",
        controllerAs: "$ctrl",
        size: "lg",
        resolve: {
          mediaService: this,
          file: function () {
            return file;
          },
          w,
          h,
          rto,
          autoSave,
        },
      });
      modalInstance.result.then(
        function (result) {
          scope.croppieCallback(result);
        },
        function () {}
      );
    };
    serviceFactory.openCroppie = _openCroppie;
    serviceFactory.cloneMedia = _cloneMedia;
    serviceFactory.uploadMedia = _uploadMedia;
    serviceFactory.save = _save;
    return serviceFactory;
  },
]);
