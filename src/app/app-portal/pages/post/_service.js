'use strict';
app.factory('PostService', ['BaseService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('post');
        // Define more service methods here
    return serviceFactory;
}]);
