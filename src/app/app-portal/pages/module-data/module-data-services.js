'use strict';
app.factory('ModuleDataRestService', ['BaseRestService',
    function (baseService) {        
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('module-data/portal');
        // Define more service methods here
        return serviceFactory;
    }]);
