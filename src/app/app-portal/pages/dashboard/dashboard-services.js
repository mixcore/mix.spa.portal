"use strict";
app.factory("DashboardServices", [
  "$rootScope",
  "$http",
  "ApiService",
  "CommonService",
  function ($rootScope, $http, apiService, commonService) {
    //var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';

    var usersServiceFactory = {};
    var apiUrl = "/portal/" + $rootScope.localizeSettings.lang;
    var _getDashboardInfo = async function () {
      var req = {
        method: "GET",
        url: apiUrl + "/dashboard",
      };
      return await apiService.getApiResult(req);
    };

    usersServiceFactory.getDashboardInfo = _getDashboardInfo;
    return usersServiceFactory;
  },
]);
