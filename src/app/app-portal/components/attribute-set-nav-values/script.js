modules.component('attributeSetNavValues', {
    templateUrl: '/app/app-portal/components/attribute-set-nav-values/view.html',
    bindings: {
        attributeSetId: '=',
        attributeSetName: '=',
        parentId: '=',
        parentType: '=',
        fields: '=?',
        header: '=',
        data: '=?',
        createUrl: '=?',
        updateUrl: '=?',
        onUpdate: '&?',
        onDelete: '&?',
    },
    controller: ['$rootScope', '$scope', 'ngAppSettings', 'RestRelatedAttributeDataPortalService', 'RestAttributeFieldPortalService',
        function ($rootScope, $scope, ngAppSettings, navService, fieldService) {
            var ctrl = this;
            ctrl.selectedProp = null;
            ctrl.request = angular.copy(ngAppSettings.restRequest);
            ctrl.request.orderBy = 'priority';
            ctrl.request.direction = 0;
            ctrl.settings = $rootScope.globalSettings;
            ctrl.$onInit = async function () {
                if(!ctrl.createUrl){
                    ctrl.createUrl = '/portal/attribute-set-data/create';
                }
                if(!ctrl.updateUrl){
                    ctrl.updateUrl = '/portal/attribute-set-data/details';
                }
                if (!ctrl.fields) {
                    var getFields = await fieldService.initData(ctrl.attributeSetName || ctrl.attributeSetId);
                    if (getFields.isSucceed) {
                        ctrl.fields = getFields.data;
                        $scope.$apply();
                    }
                }
                if (!ctrl.data) {
                    ctrl.loadData();
                }
            };

            ctrl.update = function (data) {
                ctrl.onUpdate({ data: data });
            };

            ctrl.delete = function (data) {
                ctrl.onDelete({ data: data });
            };

            ctrl.filterData = function (item, attributeName) {
                return $rootScope.findObjectByKey(item.data, 'attributeName', attributeName);
            };

            ctrl.dragStart = function (index) {
                ctrl.dragStartIndex = index;
                ctrl.minPriority = ctrl.data.items[0].priority;
            };
            ctrl.updateOrders = function (index) {
                if (index > ctrl.dragStartIndex) {
                    ctrl.data.items.splice(ctrl.dragStartIndex, 1);
                }
                else {
                    ctrl.data.items.splice(ctrl.dragStartIndex + 1, 1);
                }
                angular.forEach(ctrl.data.items, function (e, i) {
                    e.priority = ctrl.minPriority + i;                                        
                    navService.saveFields(e.id, {priority: e.priority}).then(resp => {
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    });
                });                
            };

            ctrl.loadData = function () {
                ctrl.request.attributeSetId = ctrl.attributeSetId || 0;
                ctrl.request.attributeSetName = ctrl.attributeSetName || null;
                ctrl.request.parentId = ctrl.parentId;
                ctrl.request.parentType = 1;
                navService.getList(ctrl.request)
                    .then(resp => {
                        if (resp) {
                            ctrl.data = resp.data;
                            $rootScope.isBusy = false;
                            $scope.$apply();
                        } else {
                            if (resp) {
                                $rootScope.showErrors('Failed');
                            }
                            ctrl.refData = [];
                            $rootScope.isBusy = false;
                            $scope.$apply();
                        }
                    });
            }
            ctrl.updateData = function (nav) {
                $rootScope.goToPath(`${ctrl.updateUrl}?dataId=${nav.dataId}&attributeSetId=${nav.attributeSetId}&parentId=${ctrl.parentId}&parentType=1`)
                // ctrl.refDataModel = nav;
                // var e = $(".pane-form-" + ctrl.attributeValue.field.referenceId)[0];
                // angular.element(e).triggerHandler('click');
                // $location.url('/portal/attribute-set-data/details?dataId='+ item.id +'&attributeSetId=' + item.attributeSetId+'&parentType=' + item.parentType+'&parentId=' + item.parentId);
            };
            ctrl.saveData = function (data) {
                $rootScope.isBusy = true;
                ctrl.refDataModel.data = data;
                dataService.save('portal', data).then(resp => {
                    if (resp.isSucceed) {
                        ctrl.refDataModel.id = resp.data.id;
                        ctrl.refDataModel.data = resp.data;
                        navService.save('portal', ctrl.refDataModel).then(resp => {
                            if (resp.isSucceed) {
                                var tmp = $rootScope.findObjectByKey(ctrl.refData, ['parentId', 'parentType', 'id'],
                                    [resp.data.parentId, resp.data.parentType, resp.data.id]);
                                if (!tmp) {
                                    ctrl.refData.push(resp.data);
                                }
                                ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
                                var e = $(".pane-data-" + ctrl.attributeValue.field.referenceId)[0];
                                angular.element(e).triggerHandler('click');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            } else {
                                $rootScope.showMessage('failed');
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            }
                        })

                    }
                    else {
                        $rootScope.showMessage('failed');
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    }
                })
            }
            ctrl.removeData = async function (nav) {
                $rootScope.showConfirm(ctrl, 'removeDataConfirmed', [nav], null, 'Remove', 'Deleted data will not able to recover, are you sure you want to delete this item?');
            };
            ctrl.removeDataConfirmed = async function (nav) {
                $rootScope.isBusy = true;
                var result = await navService.delete([nav.id]);
                if (result.isSucceed) {
                    $rootScope.removeObjectByKey(ctrl.data.items, 'id', nav.id);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                else {
                    $rootScope.showMessage('failed');
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
        }]
});