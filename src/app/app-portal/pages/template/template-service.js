'use strict';
app.factory('TemplateService', ['BaseRestService', 'CommonService',
    function (baseService, commonService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('template/portal');
        var _copy = async function (id) {
            var url = this.prefixUrl + '/copy/' + id;
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };
        serviceFactory.copy = _copy;
        return serviceFactory;

    }]);
