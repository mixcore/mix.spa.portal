app.component("loginPopup", {
  templateUrl: "/app/app-shared/components/login-popup/view.html",
  controller: "LoginPopupController",
});

app.controller("LoginPopupController", [
  "$scope",
  "$rootScope",
  "AuthService",
  "CommonService",
  function LoginPopupController(
    $scope,
    $rootScope,
    authService,
    commonService
  ) {
    $scope.loginData = {
      userName: "",
      password: "",
      rememberMe: false,
    };
    $scope.login = async function () {
      var result = await authService.loginPopup($scope.loginData);
      if (result && result.isSucceed) {
        $rootScope.isBusy = false;
        $scope.message = result.errors[0];
        $("#login-popup").modal("hide");
        $scope.$apply();

        if ($rootScope.loginCallbackRequest) {
          if ($rootScope.loginCallbackType == "rest") {
            commonService.getRestApiResult($rootScope.loginCallbackRequest);
          } else {
            commonService.getRestResult($rootScope.loginCallbackRequest);
          }
          $rootScope.loginCallbackRequest = null;
          $rootScope.loginCallbackType = null;
        }
      }
    };
    $scope.closeDialog = function () {
      $("#login-popup").modal("hide");
    };
  },
]);
