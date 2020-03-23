'use strict';
app.factory('PostAttributeValueService', ['BaseService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('post-attribute-value');
        // Define more service methods here
    return serviceFactory;
}]);
