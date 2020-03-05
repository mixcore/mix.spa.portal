'use strict';
app.factory('BaseRestService', ['$rootScope', '$routeParams', 'CommonService',
    function ($rootScope, $routeParams, commonService) {
        var serviceFactory = {};
        var _init = function (modelName, isGlobal) {
            this.modelName = modelName;
            if (!isGlobal && isGlobal != 'true') {
                this.lang = $rootScope.settings.lang;
                this.prefixUrl = '/rest/' + this.lang + '/' + modelName;
            }
            else {
                this.prefixUrl = '/rest/' + modelName;
            }
        };

        var _getSingle = async function (params = []) {
            var url = this.prefixUrl;
            for (let i = 0; i < params.length; i++) {
                if (params[i] != undefined && params[i] != null) {
                    url += '/' + params[i];
                }
            }
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };
        var _count = async function (params = []) {
            var url = this.prefixUrl + '/count';
            for (let i = 0; i < params.length; i++) {
                if (params[i] != null) {
                    url += '/' + params[i];
                }
            }
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };
        var _getList = async function (objData, params = []) {

            var data = serviceFactory.parseQuery(objData);
            var url = this.prefixUrl;
            for (let i = 0; i < params.length; i++) {
                if (params[i] != null) {
                    url += '/' + params[i];
                }
            }

            if (data) {
                url += '?';
                url = url.concat(data);
            }
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };

        var _delete = async function (params = []) {
            var url = this.prefixUrl;
            for (let i = 0; i < params.length; i++) {
                if (params[i] != null) {
                    url += '/' + params[i];
                }
            }
            var req = {
                method: 'DELETE',
                url: url
            };
            return await commonService.getRestApiResult(req);
        };

        var _create = async function (objData) {
            var url = this.prefixUrl;
            var req = {
                method: 'POST',
                url: url,
                data: JSON.stringify(objData)
            };
            return await commonService.getRestApiResult(req);
        };

        var _update = async function (objData) {
            var url = this.prefixUrl;
            var req = {
                method: 'PUT',
                url: url,
                data: JSON.stringify(objData)
            };
            return await commonService.getRestApiResult(req);
        };

        var _saveFields = async function (viewType, id, objData) {
            var url = this.prefixUrl + '/' + id;
            var req = {
                method: 'PUT',
                url: url,
                data: JSON.stringify(objData)
            };
            return await commonService.getRestApiResult(req);
        };

        var _ajaxSubmitForm = async function (form, url) {
            var req = {
                method: 'POST',
                url: url,
                headers: { 'Content-Type': undefined },
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: form
            };
            return await commonService.getRestApiResult(req);
        };
        var _parseQuery = function (req) {
            var result = '';
            if (req) {
                for (var key in req) {
                    if (req.hasOwnProperty(key)) {
                        if (result != '') {
                            result += '&';
                        }
                        result += `${key}=${req[key]}`;
                    }
                }
                return result;
            }
            else {
                return result;
            }
        };

        serviceFactory.lang = '';
        serviceFactory.prefixUrl = '';
        serviceFactory.init = _init;
        serviceFactory.count = _count;
        serviceFactory.getSingle = _getSingle;
        serviceFactory.getList = _getList;
        serviceFactory.create = _create;
        serviceFactory.update = _update;
        serviceFactory.saveFields = _saveFields;
        serviceFactory.delete = _delete;
        serviceFactory.ajaxSubmitForm = _ajaxSubmitForm;
        serviceFactory.parseQuery = _parseQuery;
        return serviceFactory;

    }]);