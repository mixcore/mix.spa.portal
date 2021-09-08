"use strict";
app.factory("PagePostRestService", [
    "$rootScope",
    "ApiService",
    "CommonService",
    "BaseService",
    function($rootScope, apiService, commonService, baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init("page-post");
        var _delete = async function(id) {
            var url = this.prefixUrl + "/delete/" + id;
            var req = {
                method: "GET",
                url: url,
            };
            return await apiService.getApiResult(req);
        };
        var _updateInfos = async function(pages) {
            var req = {
                method: "POST",
                url: this.prefixUrl + "/update-infos",
                data: JSON.stringify(pages),
            };
            return await apiService.getApiResult(req);
        };
        serviceFactory.delete = _delete;
        serviceFactory.updateInfos = _updateInfos;
        return serviceFactory;
    },
]);