"use strict";
app.factory("Step5Services", [
  "ApiService",
  "CommonService",
  function (apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var service = {};
    var _submit = async function (data) {
      var req = {
        method: "POST",
        url: "/init/init-cms/step-5",
        data: JSON.stringify(data),
      };
      return await apiService.getApiResult(req);
    };
    service.submit = _submit;
    return service;
  },
]);
