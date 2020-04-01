'use strict';
app.factory('AttributeFieldClientRestService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('attribute-field/client');
    var _initData = async function (attrSetName) {
        var url = this.prefixUrl + '/init/' + attrSetName;
        var req = {
            method: 'GET',
            url: url
        };
        return await commonService.getRestApiResult(req);
    };
    serviceFactory.initData = _initData;
    return serviceFactory;

}]);
