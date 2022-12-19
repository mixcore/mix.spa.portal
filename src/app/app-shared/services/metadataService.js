"use strict";
appShared.factory("MetadataService", [
  "BaseRestService",
  function (baseService) {
    var serviceFactory = Object.create(baseService);
    serviceFactory.initService("/rest/mix-services", "metadata");

    var _getOrCreateMetadata = async function (objData) {
      var url = `${this.prefixUrl}/get-or-create-metadata`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await this.getRestApiResult(req);
    };

    var _deleteMetadataContentAssociation = async function (id) {
      var url = `${this.prefixUrl}/delete-metadata-association/${id}`;
      var req = {
        serviceBase: this.serviceBase,
        method: "DELETE",
        url: url,
      };
      return await this.getRestApiResult(req);
    };
    var _createMetadataContentAssociation = async function (objData) {
      var url = `${this.prefixUrl}/create-metadata-association`;
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        data: JSON.stringify(objData),
      };
      return await this.getRestApiResult(req);
    };

    var _getMetadataByContent = async function (
      contentType,
      contentId,
      request
    ) {
      var url = `${this.prefixUrl}/get-metadata/${contentType}/${contentId}`;
      var data = serviceFactory.parseQuery(request);
      if (data) {
        url += "?";
        url = url.concat(data);
      }
      var req = {
        serviceBase: this.serviceBase,
        method: "GET",
        url: url,
        data: request,
      };
      return await this.getRestApiResult(req);
    };
    // Define more service methods here
    serviceFactory.createMetadataContentAssociation =
      _createMetadataContentAssociation;
    serviceFactory.deleteMetadataContentAssociation =
      _deleteMetadataContentAssociation;
    serviceFactory.getMetadataByContent = _getMetadataByContent;
    serviceFactory.getOrCreateMetadata = _getOrCreateMetadata;
    return serviceFactory;
  },
]);
