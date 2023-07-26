"use strict";
appShared.factory("MixDbService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = angular.copy(baseService);
    serviceFactory.init("mix-db");
    var _initDbName = function (name) {
      serviceFactory.init(`mix-db/${name}`);
    };
    var _filter = async function (request) {
      var url = `${this.prefixUrl}/filter`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: request,
      };
      return await this.getRestApiResult(req);
    };
    var _export = async function (request) {
      var url = `${this.prefixUrl}/export`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: request,
      };
      return await this.getRestApiResult(req);
    };
    var _import = async function (file) {
      var url = `${this.prefixUrl}/import`;
      var frm = new FormData();
      frm.append("file", file);
      return await this.ajaxSubmitForm(frm, url);
    };
    var _getSingleByParent = async function (parentType, parentId) {
      var url = `${this.prefixUrl}/get-by-parent/${parentType}/${parentId}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.initDbName = _initDbName;
    serviceFactory.filter = _filter;
    serviceFactory.export = _export;
    serviceFactory.import = _import;
    serviceFactory.getSingleByParent = _getSingleByParent;
    return serviceFactory;
  },
]);
