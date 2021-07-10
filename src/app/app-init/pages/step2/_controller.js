"use strict";
app.controller("Step2Controller", [
  "$scope",
  "$rootScope",
  "ApiService",
  "Step2Services",
  "AuthService",
  function ($scope, $rootScope, apiService, services, authService) {
    $scope.user = {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgreed: false,
    };
    $scope.init = async function () {};
    $scope.register = async function () {
      if (!$scope.user.isAgreed) {
        var ele = document.getElementById("notTNCYetChecked");
        ele.style.display = "block";
      } else {
        if ($scope.password !== $scope.confirmPassword) {
          $rootScope.showErrors(["Confirm Password is not matched"]);
        } else {
          $rootScope.isBusy = true;
          var result = await services.register($scope.user);
          if (result.success) {
            await apiService.getAllSettings();
            var loginData = {
              userName: $scope.user.userName,
              password: $scope.user.password,
              rememberMe: true,
            };
            var result = await authService.login(loginData);
            if (result.success) {
              $rootScope.isBusy = false;
              $rootScope.goToPath("/init/step3");
              $scope.$apply();
            } else {
              if (result) {
                $rootScope.showErrors(result.errors);
              }
              $rootScope.isBusy = false;
              $scope.$apply();
            }
          } else {
            if (result) {
              $rootScope.showErrors(result.errors);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
      }
    };
    $scope.advanceSetup = async function () {
      if (!$scope.user.isAgreed) {
        var ele = document.getElementById("notTNCYetChecked");
        ele.style.display = "block";
      } else {
        if ($scope.password !== $scope.confirmPassword) {
          $rootScope.showErrors(["Confirm Password is not matched"]);
        } else {
          $rootScope.isBusy = true;
          var result = await services.register($scope.user);
          if (result.success) {
            var loginData = {
              userName: $scope.user.userName,
              password: $scope.user.password,
              rememberMe: true,
            };
            var result = await authService.login(loginData);
            if (result) {
              $rootScope.isBusy = false;
              $scope.$apply();
            } else {
              if (result) {
                $rootScope.showErrors(result.errors);
              }
              $rootScope.isBusy = false;
              $scope.$apply();
            }
          } else {
            if (result) {
              $rootScope.showErrors(result.errors);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
      }
    };
  },
]);
