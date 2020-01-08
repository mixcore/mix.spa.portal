modules.component('modalNavDatas', {
    templateUrl: '/app/app-portal/components/modal-nav-datas/view.html',
    bindings: {
        attributeSetId: '=',
        attributeSetName: '=',
        query: '=',
        selected: '=',
        save: '&'
    },
    controller: ['$rootScope', '$scope', 'ngAppSettings', 'MixAttributeSetDataService',
        function ($rootScope, $scope, ngAppSettings, service) {
            var ctrl = this;
            ctrl.request = angular.copy(ngAppSettings.request);
            ctrl.request.key = 'readData';
            ctrl.navs = [];
            ctrl.selectedList = [];
            ctrl.queries = {};
            ctrl.data = { items: [] }
            ctrl.$onInit = function () {
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
                Object.keys(ctrl.queries).forEach(e => {
                    if (ctrl.queries[e]) {
                        ctrl.request.query += '&' + e + '=' + ctrl.queries[e];
                    }
                });
                var response = await service.getList(ctrl.request);
                if (response.isSucceed) {
                    ctrl.data = response.data;
                    ctrl.navs = [];
                    angular.forEach(response.data.items, function (e) {
                        e.disabled = $rootScope.findObjectByKey(ctrl.selectedList, 'id', e.id) != null;
                        // var item = {
                        //     priority: e.priority,
                        //     description: e.data.title,
                        //     postId: e.id,
                        //     image: e.thumbnailUrl,
                        //     specificulture: e.specificulture,
                        //     status: 2,
                        //     isActived: false
                        // };
                        // item[ctrl.srcField] = ctrl.srcId;
                        // ctrl.navs.push(item);
                    });
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            }
            ctrl.select = function (data) {
                if (data.isActived) {
                    var current = $rootScope.findObjectByKey(ctrl.selectedList, 'id', data.id);
                    if (!current) {
                        data.disabled = true;
                        ctrl.selectedList.push(data);
                    }
                }
                else {
                    
                    data.disabled = false;
                    $rootScope.removeObjectByKey(ctrl.selectedList, 'id', data.id);
                }
            };
        }

    ]
});