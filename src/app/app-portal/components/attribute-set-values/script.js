modules.component('attributeSetValues', {
    templateUrl: '/app/app-portal/components/attribute-set-values/view.html?v=2',
    bindings: {
        header: '=',
        data: '=',
        canDrag: '=',
        attributeSetName: '=?',
        queries: '=?',
        filterType: '=?',
        selectedList: '=',
        columns: '=?',
        onFilterList: '&?',
        onApplyList: '&?',
        onSendMail: '&?',
        onUpdate: '&?',
        onDelete: '&?',
    },
    controller: ['$rootScope', '$scope','AttributeSetService', 'AttributeSetDataService',
        function ($rootScope, $scope, setService, dataService) {
            var ctrl = this;
            ctrl.actions = ['Delete', 'SendMail'];
            ctrl.filterTypes = ['contain', 'equal'];
            ctrl.fields = [];
            ctrl.selectedProp = null;
            ctrl.settings = $rootScope.globalSettings;
            ctrl.$onInit = async function(){
                if(!ctrl.selectedList){
                    ctrl.selectedList = {
                        action: 'Delete',
                        data: []
                    };
                }
                var getAttrSet = await setService.getSingle('portal', ['by-name', ctrl.attributeSetName]);
                if(getAttrSet){
                    ctrl.fields = getAttrSet.fields;
                    $scope.$apply();
                }
                // if(ctrl.data[0] && ctrl.data[0].fields){
                //     ctrl.fields = angular.copy(ctrl.data[0].fields);
                // }
            };
            ctrl.select = function (item) {
                if (item.isSelected) {
                    var current = $rootScope.findObjectByKey(ctrl.selectedList, 'id', item.id);
                    if (!current) {
                        ctrl.selectedList.data.push(item);
                    }
                }
                else {
                    $rootScope.removeObject(ctrl.selectedList, item.id);
                }
            };
            ctrl.selectAll = function (isSelected) {
                ctrl.selectedList.data = [];
                angular.forEach(ctrl.data, function (e) {
                    e.isSelected = isSelected;
                    if (isSelected) {
                        ctrl.selectedList.data.push(e.id);
                    }
                });

            };
            ctrl.filter = function () {
            };
            ctrl.sendMail = async function (data) {
                ctrl.onSendMail({ data: data });
            };
            ctrl.apply = async function () {
                ctrl.onApplyList();
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
            };
            ctrl.updateOrders = function (index) {
                if (index > ctrl.dragStartIndex) {
                    ctrl.data.splice(ctrl.dragStartIndex, 1);
                }
                else {
                    ctrl.data.splice(ctrl.dragStartIndex + 1, 1);
                }
                angular.forEach(ctrl.data, function (e, i) {
                    e.priority = i;
                });
            };
        }]
});