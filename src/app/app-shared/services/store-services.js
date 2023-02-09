﻿"use strict";
appShared.factory("StoreService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("", null, "en-us", "https://market.mixcore.net", "v2");
    // Define more service methods here
    var _getThemes = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = "/rest/post-content/filter";
      var req = {
        serviceBase: this.serviceBase,
        apiVersion: this.apiVersion,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await this.getRestApiResult(req);
    };

    var _getCategories = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = "/rest/en-us/mix-database-data/client";

      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        serviceBase: this.serviceBase,
        apiVersion: this.apiVersion,
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };

    serviceFactory.getThemes = _getThemes;
    serviceFactory.getCategories = _getCategories;

    return serviceFactory;
  },
]);
