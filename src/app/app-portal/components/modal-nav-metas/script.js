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
    controller: ['$rootScope', '$scope', 'ngAppSettings', 'MixAttributeSetDataService', 'RelatedAttributeSetDataService',
        function ($rootScope, $scope, ngAppSettings, service, navService) {
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
                if (ctrl.attributeSetId) {
                    ctrl.request.query = 'attributeSetId=' + ctrl.attributeSetId;
                }
                if (ctrl.attributeSetName) {
                    ctrl.request.query += '&attributeSetName=' + ctrl.attributeSetName;
                }
            }
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
                    ctrl.request.query = 'attributeSetId=' + ctrl.attributeSetId;
                }
                if (ctrl.attributeSetName) {
                    ctrl.request.query += '&attributeSetName=' + ctrl.attributeSetName;
                }
                if (ctrl.type) {
                    ctrl.request.query += '&type=' + ctrl.type;
                }
                Object.keys(ctrl.queries).forEach(e => {
                    if (ctrl.queries[e]) {
                        ctrl.request.query += '&' + e + '=' + ctrl.queries[e];
                    }
                });
                ctrl.request.key = 'data';
                var response = await service.getList(ctrl.request);
                if (response.isSucceed) {
                    ctrl.data = response.data;
                    ctrl.navs = [];
                    angular.forEach(response.data.items, function (e) {
                        // Not show data if there's in selected list
                        e.disabled = $rootScope.findObjectByKey(ctrl.selectedList, 'id', e.id) != null;
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
            ctrl.select = function (data) {
                var nav = {
                    specificulture: data.specificulture,
                    attributesetName: ctrl.attributeSetName,
                    parentId: ctrl.parentId,
                    parentType: ctrl.parentType,
                    id: data.id,
                    data: {data: data}
                };
                if (data.isActived) {
                    if (ctrl.parentId) {
                        
                        navService.save('portal', nav).then(resp => {
                            if (resp.isSucceed) {
                                var current = $rootScope.findObjectByKey(ctrl.selectedList, 'id', data.id);
                                if (!current) {
                                    data.disabled = true;
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
                        var current = $rootScope.findObjectByKey(ctrl.selectedList, 'id', data.id);
                        if (!current) {
                            data.disabled = true;
                            ctrl.selectedList.push(nav);
                        }

                    }
                }
                else {
                    if (ctrl.parentId) {
                        navService.delete([ctrl.parentId, ctrl.parentType, data.id]).then(resp => {
                            if (resp.isSucceed) {
                                data.disabled = false;
                                var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'id', data.id);
                                if (tmp) {
                                    tmp.disabled = false;
                                }
                                $rootScope.removeObjectByKey(ctrl.selectedList, 'id', data.id);
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
                        var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'id', data.id);
                        if (tmp) {
                            tmp.disabled = false;
                        }
                        $rootScope.removeObjectByKey(ctrl.selectedList, 'id', data.id);
                    }

                }
                if (ctrl.selectCallback) {
                    ctrl.selectCallback({ data: nav });
                }
            };
            ctrl.createData = function () {
                var tmp = $rootScope.findObjectByKey(ctrl.data.items, 'title', ctrl.newTitle);
                if(!tmp){
                    var data = {
                        title: ctrl.newTitle,
                        slug: $rootScope.generateKeyword(ctrl.newTitle, '-'),
                        type: ctrl.type
                    };
                    service.saveByName(ctrl.attributeSetName, data).then(resp => {
                        if (resp.isSucceed) {
                            resp.data.isActived = true;
                            ctrl.data.items.push(resp.data.data);
                            // $rootScope.showMessage('success', 'success');
                            // $rootScope.isBusy = false;                        
                            // $scope.$apply();
    
                            ctrl.select(resp.data.data);
                        } else {
                            $rootScope.showErrors(resp.errors);
                            $rootScope.isBusy = false;
                            $scope.$apply();
                        }
                    });
                }
                else{
                    tmp.isActived = true;
                    ctrl.select(tmp);
                }
                
            }
        }

    ]
});