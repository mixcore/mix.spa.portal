"use strict";
app.factory("Step4Services", [
  "ApiService",
  "CommonService",
  function (apiService, commonService) {
    var service = {};

    var _loadTheme = async function () {
      var req = {
        method: "GET",
        url: "/rest/mix-tenancy/setup/load-theme",
      };
      return await apiService.sendRequest(req);
    };
    var _submit = async function (data) {
      var req = {
        method: "POST",
        url: "/rest/mix-tenancy/setup/import-theme",
        data: JSON.stringify(data),
      };
      return await apiService.sendRequest(req);
    };
    service.loadTheme = _loadTheme;
    service.submit = _submit;
    return service;
  },
]);
