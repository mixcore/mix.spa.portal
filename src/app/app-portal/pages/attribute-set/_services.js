'use strict';
app.factory('AttributeSetService', ['BaseRestService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('attribute-set/portal', true);
        // Define more service methods here
    return serviceFactory;
}]);
