modules.component('modalContentFilter', {
    templateUrl: '/app/app-portal/components/modal-content-filter/modal-content-filter.html',
    bindings: {
        query: '=',
        initData: '=?',
        selected: '=',
        callback: '&?',
        save: '&?'
    },
    controller: ModalContentFilterController
});

function ModalContentFilterController($rootScope, $scope, $element, ngAppSettings, PostRestService, PageRestService, callback) {
    $scope.callback = callback;
    const postService = PostRestService;
    const pageService = PageRestService;
    $scope.request = angular.copy(ngAppSettings.request);
    $scope.types = ['Page', 'Post'];
    $scope.type = 'Page';
    $scope.navs = [];
    $scope.data = {
        items: []
    };
    $scope.goToPath = $rootScope.goToPath;
    $scope.init = function () {
        if ($scope.initData) {
            $scope.data = $scope.initData;
        } else {
            $scope.loadData();
        }
    };
    $scope.closeDialog = function () {
        $($element).modal('hide');
    };
    $scope.loadData = async function (pageIndex) {
        $rootScope.isBusy = true;
        $scope.request.query = $scope.query + $scope.srcId;
        $scope.navs = [];
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

        switch ($scope.type) {
            case 'Page':
                var response = await pageService.getList($scope.request);
                if (response.isSucceed) {
                    $scope.data = response.data;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                } else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                break;
            case 'Post':
                var response = await postService.getList($scope.request);
                if (response.isSucceed) {
                    $scope.data = response.data;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                } else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                break;
        }
    };
    $scope.edit = function (nav) {
        switch ($scope.type) {
            case 'Page':
                $scope.goToPath(`/portal/page/details/${nav.id}`);
                break;
            case 'Post':
                $scope.goToPath(`/portal/post/details/${nav.id}`);
                break;
            case 'Module':
                $scope.goToPath(`/portal/module/details/${nav.id}`);
                break;
        }
    }
    $scope.select = function (nav) {
        var current = $rootScope.findObjectByKey($scope.data.items, 'id', nav.id);
        if (!nav.isActive && $scope.callback) {
            $scope.callback({
                nav: nav,
                type: $scope.type
            });
        }
        if ($scope.isMultiple) {
            current.isActive = !current.isActive;
        } else {
            if (!nav.isActive) {
                angular.forEach($scope.data.items, element => {
                    element.isActive = false;
                });
            }
            current.isActive = !nav.isActive;
        }
    };
    $scope.saveSelected = function () {
        $scope.selected = $rootScope.filterArray($scope.data, ['isActived'], [true]);
        setTimeout(() => {
            $scope.save().then(() => {
                $scope.loadPosts();
            });

        }, 500);

    };
    $scope.limString = function (str, max) {
        if (str) {
            return (str.length > max) ? str.substring(0, max) + ' ...' : str;
        }
    };
}