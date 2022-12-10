"use strict";
appShared.factory("RestMixDatabasePortalService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database");
    var _migrate = async function (data) {
      var url = `${this.prefixUrl}/migrate/${data.systemName}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _backup = async function (data) {
      var url = `${this.prefixUrl}/backup/${data.systemName}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _restore = async function (data) {
      var url = `${this.prefixUrl}/restore/${data.systemName}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _getByName = async function (name) {
      var url = `${this.prefixUrl}/get-by-name/${name}`;
      var req = {
        method: "GET",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    serviceFactory.migrate = _migrate;
    serviceFactory.backup = _backup;
    serviceFactory.restore = _restore;
    serviceFactory.getByName = _getByName;
    return serviceFactory;
  },
]);
