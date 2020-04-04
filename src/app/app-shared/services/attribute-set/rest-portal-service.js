'use strict';
app.factory('RestAttributeSetPortalService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('attribute-set/portal');
    return serviceFactory;

}]);
