"use strict";
app.factory("RoleService", [
  "BaseRestService",
  "ApiService",
  "CommonService",
  function (baseService, apiService, commonService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("role", true);

    var _getPermissions = async function () {
      var req = {
        method: "GET",
        url: this.prefixUrl + "/permissions",
      };
      return await apiService.getApiResult(req);
    };

    var _updatePermission = async function (permission) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/update-permission",
        data: JSON.stringify(permission),
      };
      return await apiService.getApiResult(req);
    };
    var _createRole = function (name) {
      var req = {
        method: "POST",
        url: this.prefixUrl + "/create",
        data: JSON.stringify(name),
      };

      return apiService.getRestApiResult(req);
    };
    serviceFactory.createRole = _createRole;
    serviceFactory.getPermissions = _getPermissions;
    serviceFactory.updatePermission = _updatePermission;
    return serviceFactory;
  },
]);
