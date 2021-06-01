"use strict";
app.factory("Step1Services", [
  "$http",
  "$rootScope",
  "AppSettings",
  "ApiService",
  "CommonService",
  function (apiService) {
    var step1ServiceFactory = {};
    var _initCms = async function (data) {
      var req = {
        method: "POST",
        url: "/init/init-cms/step-1",
        data: JSON.stringify(data),
      };
      return await apiService.getAnonymousApiResult(req);
    };

    step1ServiceFactory.initCms = _initCms;
    return step1ServiceFactory;
  },
]);
