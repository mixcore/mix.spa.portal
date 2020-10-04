'use strict';
app.controller('AttributeSetController', [
    '$scope', '$rootScope', '$location',
    'ngAppSettings', '$routeParams', 'RestAttributeFieldPortalService', 'RestAttributeSetPortalService',      
    function ($scope, $rootScope, $location, 
        ngAppSettings, $routeParams, attributeFieldService, service) {
        BaseRestCtrl.call(this, $scope, $rootScope, $location, $routeParams, ngAppSettings, service);
        $scope.defaultAttr = null;
        $scope.actions= ['Delete'];
        // $scope.request.selects = 'id,title,name,createdDateTime';
        $scope.orders = [{ title: 'Id', value: 'id' }, { title: 'Name', value: 'name' }, { title: 'Created Date', value: 'createdDateTime' }];
        $scope.request.orderBy = 'createdDateTime';
        $scope.getSingleSuccessCallback = async function () {
            var getDefaultAttr = await attributeFieldService.getDefault();
            if (getDefaultAttr.isSucceed) {
                $scope.defaultAttr = getDefaultAttr.data;
                $scope.defaultAttr.options = [];
            }
            $scope.$apply();
        }
        
    }
]);