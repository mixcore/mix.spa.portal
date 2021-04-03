"use strict";
appShared.factory("MediaService", [
  "$rootScope",
  "ApiService",
  "CommonService",
  "BaseService",
  function ($rootScope, apiService, commonService, baseService) {
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
    serviceFactory.cloneMedia = _cloneMedia;
    serviceFactory.uploadMedia = _uploadMedia;
    serviceFactory.save = _save;
    return serviceFactory;
  },
]);
