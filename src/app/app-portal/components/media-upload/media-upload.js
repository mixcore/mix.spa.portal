
modules.component('mediaUpload', {
    templateUrl: '/app/app-portal/components/media-upload/media-upload.html',
    controller: ['$scope', '$rootScope', 'MediaService', 'CommonService',
        function ($scope, $rootScope, service, commonService) {
            var ctrl = this;
            ctrl.viewModel = {
                title: '',
                description: '',
                status: 'Published',
                mediaFile: {
                    file: null,
                    fullPath: '',
                    folderName: 'Media',
                    fileFolder: '',
                    fileName: '',
                    extension: '',
                    content: '',
                    fileStream: ''
                }
            };
            ctrl.save = async function (data) {
                $rootScope.isBusy = true;
                var resp = await service.save(data);
                if (resp && resp.isSucceed) {
                    $scope.viewModel = resp.data;
                    $rootScope.showMessage('success', 'success');
                    $rootScope.isBusy = false;
                    if(ctrl.onUpdate){
                        ctrl.onUpdate();
                    }
                    $scope.$apply();
                } else {
                    if (resp) {
                        $rootScope.showErrors(resp.errors);
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            }
        }],
    bindings: {
        'onUpdate': '&'
    }
});