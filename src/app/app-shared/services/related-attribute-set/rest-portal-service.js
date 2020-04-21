'use strict';
app.factory('RestRelatedAttributeSetPortalService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('related-attribute-set/portal');
    return serviceFactory;

}]);
