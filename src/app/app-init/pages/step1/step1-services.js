"use strict";
app.factory("Step1Services", [
  "ApiService",
  function (apiService) {
    var step1ServiceFactory = {};
    var _initCms = async function (data) {
      var req = {
        method: "POST",
        url: "/mix-theme/init/init-cms/step-1",
        data: JSON.stringify(data),
      };
      return await apiService.sendRequest(req, true);
    };

    step1ServiceFactory.initCms = _initCms;
    return step1ServiceFactory;
  },
]);
