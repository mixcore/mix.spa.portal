"use strict";
appShared.factory("RestMixAssociationPortalService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.init("mix-db-association");

    serviceFactory.getAssociation = async (
      parentDbName,
      childDbName,
      parentId,
      childId
    ) => {
      var url = `${serviceFactory.prefixUrl}/${parentDbName}/${childDbName}/${
        parentId || guidParentId
      }/${childId}`;
      var req = {
        serviceBase: serviceFactory.serviceBase,
        apiVersion: serviceFactory.apiVersion,
        method: "GET",
        url: url,
      };
      return await serviceFactory.getRestApiResult(req);
    };
    serviceFactory.deleteAssociation = async (
      parentDbName,
      childDbName,
      parentId,
      guidParentId,
      childId
    ) => {
      var url = `${serviceFactory.prefixUrl}/${parentDbName}/${childDbName}/${parentId}/${childId}`;
      var req = {
        serviceBase: serviceFactory.serviceBase,
        apiVersion: serviceFactory.apiVersion,
        method: "DELETE",
        url: url,
      };
      return await serviceFactory.getRestApiResult(req);
    };
    return serviceFactory;
  },
]);
