'use strict';
app.controller('StoreController',
    ['$scope', '$rootScope', 'ngAppSettings', '$routeParams', '$location', 'StoreService',
        function ($scope, $rootScope, ngAppSettings, $routeParams, $location, service) {
            BaseRestCtrl.call(
                this,
                $scope,
                $rootScope,
                $location,
                $routeParams,
                ngAppSettings,
                service
              );
            $scope.request.key = 'service.store';
            $scope.cates = ngAppSettings.enums.configuration_cates;
            $scope.settings = $rootScope.globalSettings;
        }]);
