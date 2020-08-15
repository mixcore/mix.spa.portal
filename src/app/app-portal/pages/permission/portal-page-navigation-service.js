'use strict';
app.factory('RestPortalPageNavigationService', ['BaseRestService','CommonService', function (baseService, commonService) {

    var serviceFactory = Object.create(baseService);
    serviceFactory.init('portal-page-navigation', true);
    
    return serviceFactory;

}]);
