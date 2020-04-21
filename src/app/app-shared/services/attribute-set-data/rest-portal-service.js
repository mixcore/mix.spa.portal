'use strict';
app.factory('RestAttributeSetDataPortalService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = angular.copy(baseService);
    serviceFactory.init('attribute-set-data/portal');
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
