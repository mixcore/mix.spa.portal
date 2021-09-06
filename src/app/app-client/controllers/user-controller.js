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
        window.top.location = window.top.location;
      } else {
        alert(result.errors[0]);
      }
    };

    $scope.save = async function () {
      $rootScope.isBusy = true;
      var resp = null;
      if (!user.id) {
        resp = await userService.register($scope.user);
      } else {
        resp = await userService.saveUser($scope.user);
      }
      if (resp && resp.isSucceed) {
        $scope.user = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
        authService
          .refreshToken(
            authService.authentication.refresh_token,
            authService.authentication.access_token
          )
          .then(() => {
            window.location = window.location;
          });
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
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
    $scope.save = async function () {
      $rootScope.isBusy = true;
      var resp = await userService.saveUser($scope.user);
      if (resp && resp.isSucceed) {
        $rootScope.showMessage("Update successfully!", "success");
        if ($scope.user.id == authService.authentication.info.id) {
          authService
            .refreshToken(
              authService.authentication.refresh_token,
              authService.authentication.access_token
            )
            .then(() => {
              window.location = window.location;
            });
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
