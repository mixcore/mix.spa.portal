'use strict';
app.factory('RestMvcPostService', ['BaseRestService',
    function (baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('post/mvc');
        // Define more service methods here
    return serviceFactory;
}]);
