'use strict';
app.controller('ModalPostController', [
    '$scope', '$rootScope', '$location', 'ngAppSettings', '$routeParams', 'PostService',
    function (
        $scope, $rootScope, $location, ngAppSettings, $routeParams, service) {
        BaseCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings, service);
        $scope.columns = [{
                title: 'Title',
                name: 'title',
                filter: true,
                type: 'string'
            },           
            {
                title: 'Url',
                name: 'imageUrl',
                filter: true,
                type: 'upload'
            },
        ];
    }
]);