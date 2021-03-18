'use strict';
appShared.factory('StoreService', ['BaseRestService', function (baseService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('post/client', null, 'en-us', 'https://store.mixcore.org');
    // Define more service methods here

    return serviceFactory;

}]);
