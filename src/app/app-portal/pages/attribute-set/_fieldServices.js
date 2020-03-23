'use strict';
app.factory('AttributeFieldService', ['BaseService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('attribute-field');
        // Define more service methods here
    return serviceFactory;
}]);
