"use strict";
app.factory("UserServices", [
  "ApiService",
  "ngAppSettings",
  function (apiService, ngAuthSettings) {
    var usersServiceFactory = {};
    var apiUrl = "/rest/mix-account/user";

    var serviceBase = ngAuthSettings.serviceBase;

    var _getUserDemographicInfo = function () {
      var url = "/GetUserDemographicInfo";
      var req = {
        method: "GET",
        url: serviceBase + url,
      };

      return apiService.sendRequest(req);
    };

    var _importUsers = function (strBase64) {
      var url = "import-users";
      var req = {
        method: "POST",
        url: apiUrl + url,
        data: JSON.stringify({ strBase64: strBase64 }),
      };

      return apiService.sendRequest(req);
    };

    var _getUsers = function (request) {
      var data = _parseQuery(request);
      var url = `${apiUrl}/list`;

      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        method: "GET",
        url: url,
        data: request,
      };

      return apiService.sendRequest(req);
    };

    var _getUser = async function (id, viewType) {
      var url = "/rest/mix-account/user/details";
      if (id) {
        url += "/" + id;
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _getMyProfile = async function () {
      var url = "/rest/mix-account/user/my-profile";
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _updateRoleStatus = function (userInRole) {
      var req = {
        method: "POST",
        url: serviceBase + "/rest/mix-account/user/user-in-role",
        data: JSON.stringify(userInRole),
      };

      return apiService.sendRequest(req);
    };

    var _saveUser = async function (user) {
      var apiUrl = "/rest/mix-account/user/save";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(user),
      };
      return await apiService.sendRequest(req);
    };

    var _register = async function (user) {
      var apiUrl = "/rest/mix-account/user/";
      var req = {
        method: "POST",
        url: apiUrl + "register",
        data: JSON.stringify(user),
      };
      return await apiService.sendRequest(req);
    };

    var _removeUser = function (userId) {
      var req = {
        method: "DELETE",
        url: apiUrl + "/remove-user/" + userId,
      };

      return apiService.sendRequest(req);
    };

    var _parseQuery = function (req) {
      var result = "";
      if (req) {
        for (var key in req) {
          if (angular.isObject(req.query)) {
            req.query = JSON.stringify(req.query);
          }
          if (req.hasOwnProperty(key) && req[key]) {
            if (result != "") {
              result += "&";
            }
            result += `${key}=${req[key]}`;
          }
        }
        return result;
      } else {
        return result;
      }
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
