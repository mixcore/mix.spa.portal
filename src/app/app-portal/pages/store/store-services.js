﻿'use strict';
app.factory('StoreService', ['BaseRestService', function (baseService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('post/client', null, false, 'https://store.mixcore.org');
    // Define more service methods here

    return serviceFactory;

}]);
