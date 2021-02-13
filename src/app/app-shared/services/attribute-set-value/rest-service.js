'use strict';
app.factory('RestAttributeValuePortalService', ['BaseRestService',
    function (baseService) {

        var serviceFactory = Object.create(baseService);
        serviceFactory.init('attribute-set-value/portal');
        return serviceFactory;

    }]);
