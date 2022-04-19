﻿"use strict";
app.factory("UserService", [
  "ApiService",
  function (apiService) {
    var usersServiceFactory = {};

    var _getMyProfile = async function () {
      var apiUrl = "/rest/mix-account/user";
      var url = apiUrl + "my-profile";
      var req = {
        method: "GET",
        url: url,
      };
      return await apiService.getApiResult(req);
    };

    var _saveUser = async function (user) {
      var apiUrl = "/rest/mix-account/save";
      var req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(user),
      };
      return await apiService.getApiResult(req);
    };

    var _register = async function (user) {
      var apiUrl = "/rest/mix-account/";
      var req = {
        method: "POST",
        url: apiUrl + "register",
        data: JSON.stringify(user),
      };
      return await apiService.getApiResult(req);
    };

    usersServiceFactory.getMyProfile = _getMyProfile;
    usersServiceFactory.saveUser = _saveUser;
    usersServiceFactory.register = _register;
    return usersServiceFactory;
  },
]);
