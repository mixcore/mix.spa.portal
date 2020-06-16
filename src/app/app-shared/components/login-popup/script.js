
app.component('loginPopup', {
    templateUrl: '/app/app-shared/components/login-popup/view.html',
    controller: 'LoginPopupController'
});

app.controller('LoginPopupController', ['$scope', '$rootScope', 'AuthService', 
    function LoginPopupController($scope, $rootScope, authService) {
    $scope.loginData = {
        userName: "",
        password: "",
        rememberMe: false
    };
    $scope.login = async function () {
        var result = await authService.loginPopup($scope.loginData);
        if (result) {
            $rootScope.isBusy = false;
            $scope.message = result.errors[0];
            $('#login-popup').modal('hide');
            $scope.$apply();
        }
    };
    $scope.closeDialog = function() {
        $('#login-popup').modal('hide');
    };
  }]);