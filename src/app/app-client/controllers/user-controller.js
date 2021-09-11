app.controller("UserController", [
  "$rootScope",
  "$scope",
  "AuthService",
  "UserService",
  function ($rootScope, $scope, authService, userService) {
    $scope.loginData = {
      username: "",
      password: "",
      rememberme: true,
    };
    $scope.user = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      userData: {},
    };
    $scope.init = function () {
      authService.fillAuthData().then((resp) => {
        if (authService.authentication.info) {
          $scope.user = authService.authentication.info;
          $scope.showLogin = false;
          $scope.userData = authService.authentication.info.userData;
        } else {
          $scope.showLogin = true;
        }
      });
    };
    $scope.logout = function () {
      authService.logOut();
      window.top.location = window.top.location;
    };
    $scope.login = async function () {
      var result = await authService.login($scope.loginData);
      if (result.isSucceed) {
        $rootScope.executeFunctionByName("loginSuccess", [result.data]);
      } else {
        $rootScope.executeFunctionByName("loginFail", [result.errors]);
      }
    };

    $scope.save = async function () {
      $rootScope.isBusy = true;
      var resp = null;
      if (!$scope.user.id) {
        resp = await userService.register($scope.user);
      } else {
        resp = await userService.saveUser($scope.user);
      }
      if (resp && resp.isSucceed) {
        $scope.user = resp.data;
        authService
          .refreshToken(
            authService.authentication.refresh_token,
            authService.authentication.access_token
          )
          .then(() => {
            $rootScope.executeFunctionByName("saveUserSuccess", [resp.Data]);
          });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.executeFunctionByName("saveUserFail", [resp.errors]);
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.getMyProfile = async function () {
      $rootScope.isBusy = true;
      var response = await userService.getMyProfile();
      if (response.isSucceed) {
        $scope.user = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);

window.loginSuccess = function (data) {
  window.top.location = window.top.location;
};
window.loginFail = function (errors) {
  console.error(errors);
};
window.saveUserSuccess = function (data) {
  window.top.location = window.top.location;
};
window.saveUserFail = function (errors) {
  console.error(errors);
};
