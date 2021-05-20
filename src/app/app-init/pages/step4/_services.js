"use strict";
app.factory("Step4Services", [
  "ApiService",
  "CommonService",
  function (apiService, commonService) {
    var service = {};
    var _submit = async function (data) {
      var req = {
        method: "POST",
        url: "/init/init-cms/step-4",
        data: JSON.stringify(data),
      };
      return await apiService.getApiResult(req);
    };
    service.submit = _submit;
    return service;
  },
]);
