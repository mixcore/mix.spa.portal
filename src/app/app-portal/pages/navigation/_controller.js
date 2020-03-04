'use strict';
app.controller('NavigationController',
    [
        '$scope', '$rootScope', 'ngAppSettings', '$routeParams', '$location',
        'MixAttributeSetDataService', 'RelatedAttributeSetDataService', 'CommonService',
        function ($scope, $rootScope, ngAppSettings, $routeParams, $location,
            service, navService, commonService) {
            BaseCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings, service);
            $scope.defaultId = 'default';
            $scope.queries = {};
            $scope.parentId = null;
            $scope.parentType = null;
            $scope.cates = ['Site', 'System'];
            $scope.others = [];
            $scope.settings = $rootScope.globalSettings;
            $scope.canDrag = $scope.request.orderBy !== 'Priority' || $scope.request.direction !== '0';
            $scope.init = async function () {
                $scope.attributeSetId = $routeParams.attributeSetId;
                $scope.attributeSetName = $routeParams.attributeSetName;
                $scope.dataId = $routeParams.dataId;
                $scope.parentId = $routeParams.parentId;
                $scope.parentType = $routeParams.parentType;
                // $scope.refParentId = $routeParams.refParentId;
                // $scope.refParentType = $routeParams.refParentType;
                if ($scope.parentId && $scope.parentType) {
                    $scope.refDataModel = {
                        parentId: $scope.parentId,
                        parentType: $scope.parentType
                    };
                }
            };
            $scope.saveSuccessCallback = function () {
                if ($scope.refDataModel) {
                    $scope.refDataModel.id = $scope.activedData.id;
                    $scope.refDataModel.attributeSetId = $scope.activedData.attributeSetId;
                    $scope.refDataModel.attributeSetName = $scope.activedData.attributeSetName;
                    $scope.refDataModel.specificulture = $scope.activedData.specificulture;
                    $scope.refDataModel.data = $scope.activedData;
                    $rootScope.isBusy = true;
                    navService.save('portal', $scope.refDataModel).then(resp => {
                        if (resp.isSucceed) {
                            $rootScope.isBusy = false;
                            if ($scope.parentId) {
                                $location.url('/portal/navigation/details?dataId=' + $scope.parentId);
                            }
                            else {
                                $location.url('/portal/navigation/list?attributeSetId=' + $scope.activedData.attributeSetId);
                            }
                            $scope.$apply();
                        } else {
                            $rootScope.showMessage('failed');
                            $rootScope.isBusy = false;
                            $scope.$apply();
                        }
                    });
                }
            };
            $scope.getList = async function (pageIndex) {
                if (pageIndex !== undefined) {
                    $scope.request.pageIndex = pageIndex;
                }
                if ($scope.request.fromDate !== null) {
                    var d = new Date($scope.request.fromDate);
                    $scope.request.fromDate = d.toISOString();
                }
                if ($scope.request.toDate !== null) {
                    var d = new Date($scope.request.toDate);
                    $scope.request.toDate = d.toISOString();
                }
                $scope.request.query = '';
                if ($routeParams.attributeSetId) {
                    $scope.request.query = 'attributeSetId=' + $routeParams.attributeSetId;
                }
                $scope.request.query += '&attributeSetName=' + $routeParams.attributeSetName;
                if ($scope.filterType) {
                    $scope.request.query += '&filterType=' + $scope.filterType;
                }
                Object.keys($scope.queries).forEach(e => {
                    if ($scope.queries[e]) {
                        $scope.request.query += '&' + e + '=' + $scope.queries[e];
                    }
                });
                $rootScope.isBusy = true;
                var resp = await service.getList($scope.request);
                if (resp && resp.isSucceed) {

                    $scope.data = resp.data;
                    $.each($scope.data.items, function (i, data) {

                        $.each($scope.activedDatas, function (i, e) {
                            if (e.dataId === data.id) {
                                data.isHidden = true;
                            }
                        });
                    });
                    if ($scope.getListSuccessCallback) {
                        $scope.getListSuccessCallback();
                    }
                    $("html, body").animate({ "scrollTop": "0px" }, 500);
                    if (!resp.data || !resp.data.items.length) {
                        $scope.queries = {};
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                } else {
                    if (resp) {
                        $rootScope.showErrors(resp.errors);
                    }
                    if ($scope.getListFailCallback) {
                        $scope.getListFailCallback();
                    }
                    $scope.queries = {};
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            $scope.getSingle = async function () {
                $rootScope.isBusy = true;
                var id = $routeParams.id || $scope.defaultId;
                $scope.attributeSetId = $routeParams.attributeSetId;
                $scope.attributeSetName = $routeParams.attributeSetName;
                var resp = await service.getSingle('portal', [id, $scope.attributeSetName]);
                if (resp) {
                    $scope.activedData = resp;
                    $scope.activedData.parentType = $scope.parentType;
                    $scope.activedData.parentId = $scope.parentId;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                } else {
                    if (resp) {
                        $rootScope.showErrors('Failed');
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            $scope.preview = function (item) {
                item.editUrl = '/portal/post/details/' + item.id;
                $rootScope.preview('post', item, item.title, 'modal-lg');
            };
            $scope.edit = function (data) {
                $scope.goToPath('/portal/navigation/details?dataId=' + data.id + '&attributeSetId=' + data.attributeSetId + '&attributeSetName=' + data.attributeSetName);
            };
            $scope.remove = function (data) {
                $rootScope.showConfirm($scope, 'removeConfirmed', [data.id], null, 'Remove', 'Deleted data will not able to recover, are you sure you want to delete this item?');
            };

            $scope.removeConfirmed = async function (dataId) {
                $rootScope.isBusy = true;
                var result = await service.delete([dataId]);
                if (result.isSucceed) {
                    if ($scope.removeCallback) {
                        $rootScope.executeFunctionByName('removeCallback', $scope.removeCallbackArgs, $scope)
                    }
                    $scope.getList();
                }
                else {
                    $rootScope.showMessage('failed');
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };

            $scope.saveOthers = async function () {
                var response = await service.saveList($scope.others);
                if (response.isSucceed) {
                    $scope.getList();
                    $scope.$apply();
                }
                else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };

        }]);
