'use strict';
app.factory('ModalPostRestService', ['$rootScope', 'CommonService', 'BaseService',
    function ($rootScope, commonService, baseService) {

        var serviceFactory = Object.create(baseService);
        serviceFactory.init('page-post');
        return serviceFactory;

    }
]);