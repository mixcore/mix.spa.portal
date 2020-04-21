modules.component('modalNavMetas', {
    templateUrl: '/app/app-portal/components/modal-nav-metas/view.html',
    bindings: {
        header: '=',
        attributeSetId: '=?',
        attributeSetName: '=?',
        parentId: '=?',
        parentType: '=?',
        type: '=?',
        fieldDisplay: '=?',
        selectedList: '=?',
        selectCallback: '&',
        save: '&'
    },
    controller: ['$rootScope', '$scope', '$routeParams', 'ngAppSettings', 'RestAttributeSetDataPortalService', 'RestRelatedAttributeDataPortalService', 'RestAttributeFieldClientService',
        function ($rootScope, $scope, $routeParams, ngAppSettings, dataService, navService, fieldService) {
            var ctrl = this;
            ctrl.request = angular.copy(ngAppSettings.request);
            ctrl.request.key = 'readData';
            ctrl.navs = [];

            ctrl.queries = {};
            ctrl.data = { items: [] }
            ctrl.$onInit = function () {
                if (!ctrl.selectedList) {
                    ctrl.selectedList = [];
                }
                angular.forEach(ctrl.selectedList, function (e) {
                    e.isActived = true;
                });
                if (ctrl.attributeSetId) {
                    ctrl.request.attributeSetId = ctrl.attributeSetId;
                }
                if (ctrl.attributeSetName) {
                    ctrl.request.attributeSetName = ctrl.attributeSetName;
                }
                ctrl.loadDefaultModel();
            };
            ctrl.loadDefaultModel = async function () {
                ctrl.defaultNav = {
                    id: null,
                    specificulture: navService.lang,
                    dataId: null,
                    parentId: ctrl.parentId,
                    parentType: ctrl.parentType,
                    attributeSetId: ctrl.attributeSetId,
                    attributeSetName: ctrl.attributeSetName,
                    status: 2,
                    attributeData: null
                };
                if ($routeParams.parentId) {
                    ctrl.parentId = $routeParams.parentId;
                }
                if ($routeParams.parentType) {
                    ctrl.parentType = $routeParams.parentType;
                }
                if (!ctrl.fields) {
                    var getFields = await fieldService.initData(ctrl.attributeSetName || ctrl.attributeSetId);
                    if (getFields.isSucceed) {
                        ctrl.fields = getFields.data;
                        $scope.$apply();
                    }
                }
                var getDefault = await dataService.initData(ctrl.attributeSetName || ctrl.attributeSetId);
                ctrl.defaultData = getDefault.data;
                if (ctrl.defaultData) {
                    ctrl.defaultData.attributeSetId = ctrl.attributeSetId || 0;
                    ctrl.defaultData.attributeSetName = ctrl.attributeSetName;
                    ctrl.defaultData.parentId = ctrl.parentId;
                    ctrl.defaultData.parentType = ctrl.parentType;
                }

                if (!ctrl.attrData) {
                    ctrl.attrData = angular.copy(ctrl.defaultData);
                }
            };
            ctrl.reload = async function () {
                ctrl.newTitle = '';
                ctrl.attrData = angular.copy(ctrl.defaultData);
            };
            ctrl.loadData = async function (pageIndex) {
                ctrl.request.query = '';
                if (pageIndex !== undefined) {
                    ctrl.request.pageIndex = pageIndex;
                }
                if (ctrl.request.fromDate !== null) {
                    var d = new Date(ctrl.request.fromDate);
                    ctrl.request.fromDate = d.toISOString();
                }
                if (ctrl.request.toDate !== null) {
                    var d = new Date(ctrl.request.toDate);
                    ctrl.request.toDate = d.toISOString();
                }
                if (ctrl.attributeSetId) {
                    ctrl.request.attributeSetId = ctrl.attributeSetId;
                }
                if (ctrl.attributeSetName) {
                    ctrl.request.attributeSetName = ctrl.attributeSetName;
                }
                if (ctrl.type) {
                    ctrl.request.type = ctrl.type;
                }
                Object.keys(ctrl.queries).forEach(e => {
                    if (ctrl.queries[e]) {
                        ctrl.request[e] = ctrl.queries[e];
                    }
                });
                ctrl.request.key = 'data';
                var response = await dataService.getList(ctrl.request);
                if (response.isSucceed) {
                    ctrl.data.items = [];
                    ctrl.navs = [];
                    angular.forEach(response.data.items, function (e) {
                        // Not show data if there's in selected list
                        e.disabled = $rootScope.findObjectByKey(ctrl.selectedList, 'dataId', e.id) != null;
                        ctrl.data.items.push(
                            {
                                specificulture: e.specificulture,
                                attributesetName: ctrl.attributeSetName,
                                parentId: ctrl.parentId,
                                parentType: ctrl.parentType,
                                dataId: e.id,
                                attributeData: e,
                                disabled: e.disabled
                            }
                        );
                    });
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            ctrl.select = function (nav) {
                if (nav.isActived) {
                    if (!nav.id && ctrl.parentId) {

                        navService.save(nav).then(resp => {
                            if (resp.isSucceed) {
                                nav.id = resp.data.id;
                                var current = $rootScope.findObjectByKey(ctrl.selectedList, 'dataId', resp.data.dataId);

                                if (!current) {
                                    nav.disabled = true;
                                    ctrl.selectedList.push(nav);
                                }
                                $rootScope.showMessage('success', 'success');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            } else {
                                $rootScope.showMessage('failed');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            }
                        });
                    }
                    else {
                        var current = $rootScope.findObjectByKey(ctrl.data.items, 'id', nav.id);                        
                        if (!current) {
                            current.disabled = true;
                        }
                        var selected = $rootScope.findObjectByKey(ctrl.data.items, 'id', nav.id);                        
                        if (!selected) {
                            ctrl.selectedList.push(nav);
                        }


                    }
                }
                else {
                    if (ctrl.parentId) {
                        navService.delete([nav.id]).then(resp => {
                            if (resp.isSucceed) {
                                nav.disabled = false;
                                nav.id = null;
                                var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'id', nav.id);
                                if (tmp) {
                                    tmp.disabled = false;
                                }
                                $rootScope.removeObjectByKey(ctrl.selectedList, 'id', nav.id);
                                $rootScope.showMessage('success', 'success');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            } else {
                                $rootScope.showMessage('failed');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            }
                        });
                    }
                    else {
                        data.disabled = false;
                        var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'id', nav.id);
                        if (tmp) {
                            tmp.disabled = false;
                        }
                        $rootScope.removeObjectByKey(ctrl.selectedList, 'id', nav.id);
                    }

                }
                if (ctrl.selectCallback) {
                    ctrl.selectCallback({ data: nav });
                }
            };
            ctrl.createData = function () {
                var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'title', ctrl.newTitle);
                if (!tmp) {
                    ctrl.isBusy = true;
                    ctrl.attrData.obj.title = ctrl.newTitle;
                    ctrl.attrData.obj.slug = $rootScope.generateKeyword(ctrl.newTitle, '-');
                    ctrl.attrData.obj.type = ctrl.type;
                    var nav = angular.copy(ctrl.defaultNav);                    
                    nav.attributeData = ctrl.attrData;
                    navService.save(nav).then(resp => {
                        if (resp.isSucceed) {
                            ctrl.data.items.push(resp.data);
                            ctrl.reload();                  
                            resp.data.isActived = true;         
                            ctrl.select(resp.data);
                            ctrl.isBusy = false;
                        } else {
                            $rootScope.showErrors(resp.errors);
                            ctrl.isBusy = true;
                            $scope.$apply();
                        }
                    });
                }
                else {
                    tmp.isActived = true;
                    ctrl.select(tmp);
                }

            }
        }

    ]
});