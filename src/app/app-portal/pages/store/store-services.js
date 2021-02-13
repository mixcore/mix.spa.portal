'use strict';
app.factory('StoreService', ['BaseService', function (baseService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('post', false, 'https://store.mixcore.org');
    // Define more service methods here

    return serviceFactory;

}]);
