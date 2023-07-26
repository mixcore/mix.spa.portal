"use strict";
app.factory("SchedulerService", [
  "AuthService",
  "ApiService",
  function (authService, apiService) {
    var serviceFactory = {};
    serviceFactory.prefixUrl = "/scheduler";
    var _createSchedule = async function (schedule) {
      var url = `${this.prefixUrl}/trigger/create`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(schedule),
      };
      return await this.getRestApiResult(req);
    };
    var _reschedule = async function (schedule) {
      var url = `${this.prefixUrl}/reschedule`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(schedule),
      };
      return await this.getRestApiResult(req);
    };
    var _execute = async function (name) {
      var url = `${this.prefixUrl}/execute/${name}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _pauseTrigger = async function (name) {
      var url = `${this.prefixUrl}/trigger/pause/${name}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _resumeTrigger = async function (name) {
      var url = `${this.prefixUrl}/trigger/resume/${name}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _getTrigger = async function (name) {
      var url = `${this.prefixUrl}/trigger/${name}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _getTriggers = async function () {
      var url = `${this.prefixUrl}/trigger`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _getJobs = async function () {
      var url = `${this.prefixUrl}/job`;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _deleteJob = async function (name) {
      var url = `${this.prefixUrl}/job/${name}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "DELETE",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    var _getRestApiResult = async function (req) {
      if (!authService.authentication) {
        await authService.fillAuthData();
      }
      if (authService.authentication) {
        req.Authorization = authService.authentication.accessToken;
      }
      if (!req.headers) {
        req.headers = {
          "Content-Type": "application/json",
        };
      }
      req.headers.Authorization = "Bearer " + req.Authorization || "";

      return apiService.sendRequest(req).then(function (resp) {
        return resp;
      });
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
    serviceFactory.execute = _execute;
    serviceFactory.parseQuery = _parseQuery;
    serviceFactory.getRestApiResult = _getRestApiResult;
    serviceFactory.createSchedule = _createSchedule;
    serviceFactory.reschedule = _reschedule;
    serviceFactory.getJobs = _getJobs;
    serviceFactory.deleteJob = _deleteJob;
    serviceFactory.getTrigger = _getTrigger;
    serviceFactory.getTriggers = _getTriggers;
    serviceFactory.pauseTrigger = _pauseTrigger;
    serviceFactory.resumeTrigger = _resumeTrigger;
    return serviceFactory;
  },
]);
