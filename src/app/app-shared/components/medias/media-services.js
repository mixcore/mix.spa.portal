'use strict';
app.factory('MediaService', ['$rootScope', 'CommonService', 'BaseService',
    function ($rootScope, commonService, baseService) {

        var serviceFactory = Object.create(baseService);
        serviceFactory.init('media');
        var _cloneMedia = async function (id) {
            var req = {
                method: 'GET',
                url: serviceFactory.prefixUrl + '/clone/' + id
            };
            return await commonService.getApiResult(req);
        };
        var _save = async function(objData, file){
            var url = this.prefixUrl + '/save';
            var fd = new FormData();
            var file =objData.mediaFile.file;
            objData.mediaFile.file = null;
            fd.append('model', angular.toJson(objData));
            fd.append('file', file);
            return await serviceFactory.ajaxSubmitForm(fd, url);
        }
        var _uploadMedia = async function (mediaFile, file) {
            //var container = $(this).parents('.model-media').first().find('.custom-file').first();
            if (mediaFile.file !== undefined && mediaFile.file !== null) {
                // Create FormData object
                var url = this.prefixUrl + '/upload-media';
                var fd = new FormData();

                fd.append('file', file);
                return await serviceFactory.ajaxSubmitForm(fd, url);
            }
        };
        serviceFactory.cloneMedia = _cloneMedia;
        serviceFactory.uploadMedia = _uploadMedia;
        serviceFactory.save = _save;
        return serviceFactory;

    }]);
