"use strict";
app.factory("RegisterServices", [
  "$http",
  "ApiService",
  "CommonService",
  function ($http, apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var usersServiceFactory = {};
    var apiUrl = "/admin/";
    var _register = async function (user) {
      var apiUrl = "/rest/mix-account/user/register";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(user),
      };

      return await apiService.sendRequest(req);
    };

    usersServiceFactory.register = _register;
    return usersServiceFactory;
  },
]);
