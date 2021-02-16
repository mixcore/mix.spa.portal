"use strict";
app.factory("RestMixDatabasePortalService", [
  "$rootScope",
  "CommonService",
  "BaseRestService",
  function ($rootScope, commonService, baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-database-data");

    var _getList = async function (
      viewType,
      objData,
      mixDatabaseId,
      mixDatabaseName,
      parentType,
      parentId
    ) {
      objData.filter = "";
      if (mixDatabaseId) {
        objData.filter += "mixDatabaseId eq " + mixDatabaseId;
      }
      if (mixDatabaseName) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "mixDatabaseName eq '" + mixDatabaseName + "'";
      }
      if (parentType) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "parentType eq " + parentType;
      }
      if (parentId) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "parentId eq '" + parentId + "'";
      }
      var data = serviceFactory.parseODataQuery(objData);
      var url = this.prefixUrl + "/" + viewType;
      if (data) {
        url = url.concat(data);
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await commonService.getApiResult(req);
    };

    var _export = async function (
      viewType,
      objData,
      mixDatabaseId,
      mixDatabaseName,
      parentType,
      parentId
    ) {
      objData.filter = "";
      if (mixDatabaseId) {
        objData.filter += "mixDatabaseId eq " + mixDatabaseId;
      }
      if (mixDatabaseName) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "mixDatabaseName eq '" + mixDatabaseName + "'";
      }
      if (parentType) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "parentType eq " + parentType;
      }
      if (parentId) {
        if (objData.filter) {
          objData.filter += " and ";
        }
        objData.filter += "parentId eq '" + parentId + "'";
      }
      var data = serviceFactory.parseODataQuery(objData);
      var url = this.prefixUrl + "/" + viewType + "/export/" + mixDatabaseName;
      if (data) {
        url = url.concat(data);
      }
      var req = {
        method: "GET",
        url: url,
      };
      return await commonService.getApiResult(req);
    };

    serviceFactory.getList = _getList;
    serviceFactory.export = _export;
    return serviceFactory;
  },
]);
