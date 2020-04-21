'use strict';
app.factory('RestRelatedAttributeDataPortalService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = angular.copy(baseService);
    serviceFactory.init('related-attribute-data/portal');
    return serviceFactory;

}]);
