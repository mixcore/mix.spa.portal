'use strict';
app.factory('MixAttributeSetDataService', ['BaseService','CommonService', function (baseService, commonService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('attribute-set-data');
    var _saveByName = async function (name, objData) {
        var url = this.prefixUrl + '/save/' + name;
        var req = {
            serviceBase: this.serviceBase,
            method: 'POST',
            url: url,
            data: JSON.stringify(objData)
        };
        return await commonService.getApiResult(req);
    };
    var _sendMail = async function (params = []) {
        var url = (this.prefixUrl || '/' + this.lang + '/' + this.modelName) + '/sendmail';
        for (let i = 0; i < params.length; i++) {
            if (params[i]) {
                url += '/' + params[i];
            }
        }
        var req = {
            method: 'GET',
            url: url
        };
        return await commonService.getApiResult(req);
    };
    
    var _import = async function (attributeSetName, file) {
        var url = (this.prefixUrl || '/' + this.lang + '/' 
            + this.modelName) + '/import-data/' + attributeSetName;
        var frm = new FormData();
        frm.append('file', file);
        return serviceFactory.ajaxSubmitForm(frm, url);
    };
    serviceFactory.saveByName = _saveByName;
    serviceFactory.import = _import;
    serviceFactory.sendMail = _sendMail;
    return serviceFactory;

}]);
