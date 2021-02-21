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
            // $scope.items = [];
            // $scope.init = function () {
            //     var req = {
            //         method: 'GET',
            //         url: 'https://api.github.com/repos/mixcore/mix.core/contributors'
            //     };
            //     $scope.getGithubApiResult(req);
            // };

            // $scope.getGithubApiResult = async function (req) {
            //     return $http(req).then(function (resp) {
            //         if (resp.status == '200') {
            //             $scope.items = resp.data;
            //         }
            //         else {
            //             console.log(resp);

            //         }
            //     },
            //         function (error) {
            //             return { isSucceed: false, errors: [error.statusText || error.status] };
            //         });
            // };
        }]);
