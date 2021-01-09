modules.component('attributeSetForm', {
    templateUrl: '/mix-app/views/app-client/components/attribute-set-form/view.html',
    bindings: {
        attrSetId: '=',
        attrSetName: '=',
        attrDataId: '=?',
        attrData: '=?',
        parentType: '=?', // attribute set = 1 | post = 2 | page = 3 | module = 4
        parentId: '=?',
        defaultId: '=',
        saveData: '&?'
    },
    controller: ['$rootScope', '$scope', 'RestAttributeSetDataPortalService',
        function ($rootScope, $scope, service) {
            var ctrl = this;
            ctrl.isBusy = false;
            ctrl.attributes = [];
            ctrl.defaultData = null;
            ctrl.selectedProp = null;
            ctrl.settings = $rootScope.globalSettings;
            ctrl.$onInit = async function () {
                ctrl.loadData();
            };
            ctrl.loadData = async function () {

                /*
                    If input is data id => load ctrl.attrData from service and handle it independently
                    Else modify input ctrl.attrData
                */
                $rootScope.isBusy = true;
                ctrl.defaultData = await service.initData(ctrl.attrSetName);
                if (ctrl.attrDataId) {
                    var getData = await service.getSingle([ctrl.attrDataId]);
                    ctrl.attrDataId = getData.data;
                    if (ctrl.attrData) {
                        ctrl.defaultData.attributeSetId = ctrl.attrData.attributeSetId;
                        ctrl.defaultData.attributeSetName = ctrl.attrData.attributeSetName;
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    } else {
                        if (ctrl.attrData) {
                            $rootScope.showErrors('Failed');
                        }
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    }

                }
                else {
                    if (!ctrl.attrData) {
                        ctrl.attrData = angular.copy(ctrl.defaultData);
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                console.log(ctrl.attrData);
            };
            ctrl.reload = async function () {
                ctrl.attrData = angular.copy(ctrl.defaultData);
            };
            ctrl.submit = async function () {
                angular.forEach(ctrl.attrData.values, function (e) {
                    //Encrypt field before send
                    if (e.field && e.field.isEncrypt) {
                        var encryptData = $rootScope.encrypt(e.stringValue);
                        e.encryptKey = encryptData.key;
                        e.encryptValue = encryptData.data;
                        e.stringValue = null;
                    }
                });

                ctrl.isBusy = true;
                var saveResult = await service.save('portal', ctrl.attrData);
                if (saveResult.isSucceed) {

                    ctrl.isBusy = false;
                } else {
                    ctrl.isBusy = false;
                    if (saveResult) {
                        $rootScope.showErrors(saveResult.errors);
                    }
                    $scope.$apply();
                }
            };

            ctrl.filterData = function (attributeName) {
                if (ctrl.attrData) {
                    var attr = $rootScope.findObjectByKey(ctrl.attrData.data, 'attributeFieldName', attributeName);
                    if (!attr) {
                        attr = angular.copy($rootScope.findObjectByKey(ctrl.defaultData.data, 'attributeFieldName', attributeName));
                        ctrl.attrData.data.push(attr);
                    }
                    return attr;
                }
            };
        }]
});