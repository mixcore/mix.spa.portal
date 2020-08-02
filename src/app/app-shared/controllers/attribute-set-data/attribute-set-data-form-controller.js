app.controller('AttributeSetFormController',
    ['$rootScope', '$scope', 'RestAttributeSetDataPortalService',
        function ($rootScope, $scope, dataService) {
            $scope.defaultData = null;
            $scope.data = null;
            $scope.formName = null;
            $scope.successMsg = 'Thành công';
            $scope.init = async function (formName, successMsg) {
                $scope.successMsg = successMsg;
                $scope.formName = formName;
                dataService.init('attribute-set-data/portal');
                var getDefault = await dataService.initData($scope.formName);
                $scope.defaultData = getDefault.data;
                if ($scope.defaultData) {
                    $scope.defaultData.attributeSetName = $scope.formName;
                    $scope.defaultData.parentType = 'Set';
                    $scope.data = angular.copy($scope.defaultData);
                }
                $scope.$apply();

            }
            $scope.submit = async () => {
                $rootScope.isBusy = true;
                var save = await dataService.save($scope.data);
                if (save.isSucceed) {
                    window.showMessage('Thông báo', $scope.successMsg);
                    $scope.data = angular.copy($scope.defaultData);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                } else {

                    if(save.errors && save.errors.length){
                        let errMsg = 'Vui lòng thực hiện lại';
                        if(save.errors[0].indexOf('is existed')){
                            errMsg = save.errors[0].toString().replace('is existed', 'đã tồn tại');
                        }
                        window.showMessage('Lỗi', errMsg);                    
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            }
        }
    ]);