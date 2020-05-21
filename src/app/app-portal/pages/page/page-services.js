'use strict';
app.factory('PageRestService', ['$rootScope', 'CommonService', 'BaseRestService',
    function ($rootScope, commonService, baseService) {

        var serviceFactory = Object.create(baseService);
        serviceFactory.init('page/portal');
        var _updateInfos = async function (pages) {

            var req = {
                method: 'POST',
                url: this.prefixUrl + '/update-infos',
                data: JSON.stringify(pages)
            };
            return await commonService.getApiResult(req);
        };
        serviceFactory.updateInfos = _updateInfos;
        return serviceFactory;

    }]);
