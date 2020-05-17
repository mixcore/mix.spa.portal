'use strict';
app.factory('ModuleDataRestService', ['BaseRestService', 'CommonService',
    function (baseService, commonService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('module-data/portal');
        // Define more service methods here
        
        var _initForm = async function(moduleId){
            var url = `${this.prefixUrl}/init-form/${moduleId}`;
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };
        serviceFactory.initForm = _initForm;
        return serviceFactory;
    }]);
