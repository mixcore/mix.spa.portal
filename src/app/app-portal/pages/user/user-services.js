"use strict";
app.factory("UserServices", [
  "ApiService",
  "ngAppSettings",
  function (apiService, ngAuthSettings) {
    var usersServiceFactory = {};
    var apiUrl = "/account/";

    var serviceBase = ngAuthSettings.serviceBase;

    var _getUserDemographicInfo = function () {
      var url = "/GetUserDemographicInfo";
      var req = {
        method: "GET",
        url: serviceBase + url,
      };

      return apiService.getApiResult(req);
    };

    var _importUsers = function (strBase64) {
      var url = "import-users";
      var req = {
        method: "POST",
        url: apiUrl + url,
        data: JSON.stringify({ strBase64: strBase64 }),
      };

      return apiService.getApiResult(req);
    };

    var _getUsers = function (request) {
      var req = {
        method: "POST",
        url: apiUrl + "list",
        data: request,
      };

      return apiService.getApiResult(req);
    };

    var _getUser = async function (id, viewType) {
      var apiUrl = "/account/";
      var url = apiUrl + "details/" + viewType;
      if (id) {
        url += "/" + id;
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };

    var _getMyProfile = async function () {
      var apiUrl = "/account/";
      var url = apiUrl + "my-profile";
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };

    var _updateRoleStatus = function (userInRole) {
      var req = {
        method: "POST",
        url: serviceBase + "/account/user-in-role",
        data: JSON.stringify(userInRole),
      };

      return apiService.getApiResult(req);
    };

    var _saveUser = async function (user) {
      var apiUrl = "/account/";
      var req = {
        method: "POST",
        url: apiUrl + "save",
        data: JSON.stringify(user),
      };
      return await apiService.getApiResult(req);
    };

    var _register = async function (user) {
      var apiUrl = "/account/";
      var req = {
        method: "POST",
        url: apiUrl + "register",
        data: JSON.stringify(user),
      };
      return await apiService.getApiResult(req);
    };

    var _removeUser = function (userId) {
      var req = {
        method: "GET",
        url: apiUrl + "remove-user/" + userId,
      };

      return apiService.getApiResult(req);
    };

    usersServiceFactory.importUsers = _importUsers;
    usersServiceFactory.getUsers = _getUsers;
    usersServiceFactory.getUser = _getUser;
    usersServiceFactory.getMyProfile = _getMyProfile;
    usersServiceFactory.saveUser = _saveUser;
    usersServiceFactory.register = _register;
    usersServiceFactory.removeUser = _removeUser;
    usersServiceFactory.updateRoleStatus = _updateRoleStatus;
    usersServiceFactory.getUserDemographicInfo = _getUserDemographicInfo;
    return usersServiceFactory;
  },
]);
