"use strict";
app.factory("Step2Services", [
  "$http",
  "ApiService",
  "CommonService",
  function ($http, apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var usersServiceFactory = {};
    var _register = async function (user) {
      var req = {
        method: "POST",
        url: "/mix-theme/setup/init-account",
        data: JSON.stringify(user),
      };

      return await apiService.sendRequest(req);
    };

    usersServiceFactory.register = _register;
    return usersServiceFactory;
  },
]);
