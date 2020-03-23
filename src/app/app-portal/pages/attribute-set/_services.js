'use strict';
app.factory('AttributeSetService', ['BaseService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('attribute-set', true);
        // Define more service methods here
    return serviceFactory;
}]);
