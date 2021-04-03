"use strict";
app.factory("RegisterServices", [
  "$http",
  "ApiService",
  "CommonService",
  function ($http, apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var usersServiceFactory = {};
    var apiUrl = "/portal/";
    var _register = async function (user) {
      var apiUrl = "/account/register";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(user),
      };

      return await apiService.getApiResult(req);
    };

    usersServiceFactory.register = _register;
    return usersServiceFactory;
  },
]);
