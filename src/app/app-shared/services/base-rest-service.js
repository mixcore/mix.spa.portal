"use strict";
app.factory("BaseRestService", [
  "$rootScope",
  "$routeParams",
  "CommonService",
  "localStorageService",
  function ($rootScope, $routeParams, commonService) {
    var serviceFactory = {};
    var _init = function (modelName, isGlobal, lang, serviceBase) {
      this.modelName = modelName;
      if(serviceBase){
        this.serviceBase = serviceBase;
      }
      if (!isGlobal && isGlobal != "true") {
        if ($rootScope.settings || lang) {
          this.lang = lang || $rootScope.settings.lang;
          this.prefixUrl = `/rest/${this.lang}/${modelName}`;
        }
      } else {
        this.prefixUrl = `/rest/${modelName}`;
      }
    };

    var _duplicate = async function (params = [], queries) {
      var url = this.prefixUrl + "/duplicate";
      for (let i = 0; i < params.length; i++) {
        if (params[i] != undefined && params[i] != null) {
          url += "/" + params[i];
        }
      }
      var querystring = _parseQuery(queries);
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: `${url}?${querystring}`,
      };
      return await commonService.getRestApiResult(req);
    };

    var _getSingle = async function (params = [], queries) {
      var url = this.prefixUrl;
      for (let i = 0; i < params.length; i++) {
        if (params[i] != undefined && params[i] != null) {
          url += "/" + params[i];
        }
      }
      var querystring = _parseQuery(queries);
      var req = {
        method: "GET",
        url: `${url}?${querystring}`,
      };
      return await commonService.getRestApiResult(req);
    };

    var _clearCache = async function (params = [], queries) {
      var url = this.prefixUrl;
      for (let i = 0; i < params.length; i++) {
        if (params[i] != undefined && params[i] != null) {
          url += "/remove-cache/" + params[i];
        }
      }
      var querystring = _parseQuery(queries);
      var req = {
        method: "GET",
        url: `${url}?${querystring}`,
      };
      return await commonService.getRestApiResult(req);
    };

    var _getDefault = async function (queriesObj) {
      var url = `${this.prefixUrl}/default`;
      var querystring = _parseQuery(queriesObj);
      var req = {
        method: "GET",
        url: `${url}?${querystring}`,
      };
      return await commonService.getRestApiResult(req);
    };
    var _count = async function (params = []) {
      var url = this.prefixUrl + "/count";
      for (let i = 0; i < params.length; i++) {
        if (params[i] != null) {
          url += "/" + params[i];
        }
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await commonService.getRestApiResult(req);
    };
    var _getList = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = this.prefixUrl;

      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await commonService.getRestApiResult(req);
    };

    var _export = async function (objData) {
      var data = serviceFactory.parseQuery(objData);
      var url = this.prefixUrl + "/export";

      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await commonService.getRestApiResult(req);
    };

    var _delete = async function (params = []) {
      var url = this.prefixUrl;
      for (let i = 0; i < params.length; i++) {
        if (params[i] != null) {
          url += "/" + params[i];
        }
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "DELETE",
        url: url,
      };
      return await commonService.getRestApiResult(req);
    };
    var _save = async function (objData) {
      if (objData.id == 0 || objData.id == null) {
        return await this.create(objData);
      } else {
        return await this.update(objData.id, objData);
      }
    };
    var _create = async function (objData) {
      var url = this.prefixUrl;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await commonService.getRestApiResult(req);
    };

    var _update = async function (id, objData) {
      var url = this.prefixUrl + "/" + id;
      var req = {
        serviceBase: this.serviceBase,
        method: "PUT",
        url: url,
        data: objData,
      };
      return await commonService.getRestApiResult(req);
    };

    var _saveFields = async function (id, objData) {
      var url = this.prefixUrl + "/" + id;
      var req = {
        serviceBase: this.serviceBase,
        method: "PATCH",
        url: url,
        data: JSON.stringify(objData),
      };
      return await commonService.getRestApiResult(req);
    };

    var _applyList = async function (objData) {
      var url = this.prefixUrl + "/list-action";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await commonService.getRestApiResult(req);
    };

    var _ajaxSubmitForm = async function (form, url) {
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        headers: { "Content-Type": undefined },
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: form,
      };
      return await commonService.getRestApiResult(req);
    };
    var _parseQuery = function (req) {
      var result = "";
      if (req) {
        for (var key in req) {
          if (req.hasOwnProperty(key)) {
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

    serviceFactory.lang = "";
    serviceFactory.prefixUrl = "";
    serviceFactory.init = _init;
    serviceFactory.count = _count;
    serviceFactory.duplicate = _duplicate;
    serviceFactory.applyList = _applyList;
    serviceFactory.clearCache = _clearCache;
    serviceFactory.getDefault = _getDefault;
    serviceFactory.getSingle = _getSingle;
    serviceFactory.getList = _getList;
    serviceFactory.export = _export;
    serviceFactory.create = _create;
    serviceFactory.update = _update;
    serviceFactory.save = _save;
    serviceFactory.saveFields = _saveFields;
    serviceFactory.delete = _delete;
    serviceFactory.ajaxSubmitForm = _ajaxSubmitForm;
    serviceFactory.parseQuery = _parseQuery;
    return serviceFactory;
  },
]);
