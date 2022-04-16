"use strict";
appShared.factory("BaseService", [
  "$rootScope",
  "$routeParams",
  "ApiService",
  "CommonService",
  function ($rootScope, $routeParams, apiService, commonService) {
    var serviceFactory = {};

    var _init = function (modelName, isGlobal, serviceBase) {
      this.modelName = modelName;
      this.serviceBase = serviceBase;
      if (!isGlobal) {
        this.lang = $rootScope.globalSettings.lang;
        this.prefixUrl = "/" + this.lang + "/" + modelName;
      } else {
        this.prefixUrl = "/" + modelName;
      }
    };
    var _getSingle = async function (params = []) {
      var url =
        (this.prefixUrl || "/" + this.lang + "/" + this.modelName) + "/details";
      for (let i = 0; i < params.length; i++) {
        if (params[i]) {
          url += "/" + params[i];
        }
      }
      var req = {
        method: "GET",
        serviceBase: this.serviceBase,
        url: url,
      };
      return await apiService.sendRequest(req);
    };
    var _getList = async function (objData, params = []) {
      var url = this.prefixUrl + "/list";
      for (let i = 0; i < params.length; i++) {
        url += "/" + params[i];
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };

      return await apiService.sendRequest(req);
    };
    var _export = async function (objData, params = []) {
      var url = this.prefixUrl + "/export";
      for (let i = 0; i < params.length; i++) {
        url += "/" + params[i];
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };

      return await apiService.sendRequest(req);
    };

    var _delete = async function (id) {
      var url = this.prefixUrl + "/delete/" + id;
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
      };
      return await apiService.sendRequest(req);
    };

    var _save = async function (objData) {
      var url = this.prefixUrl + "/save";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };
    var _saveProperties = async function (objData) {
      var url = this.prefixUrl + "/save-properties";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };
    var _saveList = async function (objData) {
      var url = this.prefixUrl + "/save-list";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };

    var _updateInfos = async function (objData) {
      var url = this.prefixUrl + "/update-infos";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };
    var _ajaxSubmitForm = async function (form, url, onUploadFileProgress) {
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        headers: { "Content-Type": undefined },
        data: form,
      };
      return await apiService.sendRequest(
        req,
        this.serviceBase,
        onUploadFileProgress || _onUploadFileProgress
      );
    };

    var _applyList = async function (objData) {
      var url = this.prefixUrl + "/apply-list";
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await apiService.sendRequest(req);
    };

    var _onUploadFileProgress = function (progress) {
      console.log(`loaded ${progress}%`);
    };

    serviceFactory.lang = "";
    serviceFactory.prefixUrl = "";
    serviceFactory.init = _init;
    serviceFactory.getSingle = _getSingle;
    serviceFactory.getList = _getList;
    serviceFactory.export = _export;
    serviceFactory.save = _save;
    serviceFactory.saveProperties = _saveProperties;
    serviceFactory.saveList = _saveList;
    serviceFactory.applyList = _applyList;
    serviceFactory.delete = _delete;
    serviceFactory.updateInfos = _updateInfos;
    serviceFactory.ajaxSubmitForm = _ajaxSubmitForm;
    return serviceFactory;
  },
]);
