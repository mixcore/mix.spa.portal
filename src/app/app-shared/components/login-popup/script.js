appShared.component("loginPopup", {
  templateUrl: "/mix-app/views/app-shared/components/login-popup/view.html",
  controller: "LoginPopupController",
});

appShared.controller("LoginPopupController", [
  "$scope",
  "$rootScope",
  "AuthService",
  "ApiService",
  "CommonService",
  function LoginPopupController(
    $scope,
    $rootScope,
    authService,
    commonService
  ) {
    $scope.loginData = {
      username: "",
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
            apiService.getRestApiResult($rootScope.loginCallbackRequest);
          } else {
            apiService.getRestResult($rootScope.loginCallbackRequest);
          }
          $rootScope.loginCallbackRequest = null;
          $rootScope.loginCallbackType = null;
        }
      } else {
        $rootScope.goToSiteUrl("/security/login");
      }
    };
    $scope.closeDialog = function () {
      $("#login-popup").modal("hide");
    };
  },
]);
