"use strict";
app.controller("UserController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$timeout",
  "$location",
  "AuthService",
  "UserServices",
  "RestMixDatabaseDataPortalService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $timeout,
    $location,
    authService,
    userServices,
    dataService
  ) {
    $scope.request = {
      pageSize: "10",
      pageIndex: 0,
      status: "Published",
      orderBy: "CreatedDateTime",
      direction: "Desc",
      fromDate: null,
      toDate: null,
      keyword: "",
    };

    $scope.mediaFile = {
      file: null,
      fullPath: "",
      folder: "User",
      title: "",
      description: "",
    };
    $scope.activedUser = null;
    $scope.relatedUsers = [];
    $rootScope.isBusy = false;
    $scope.data = {
      pageIndex: 0,
      pageSize: 1,
      totalItems: 0,
    };
    $scope.errors = [];

    $scope.range = function (max) {
      var input = [];
      for (var i = 1; i <= max; i += 1) input.push(i);
      return input;
    };

    $scope.loadUser = async function () {
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      var response = await userServices.getUser(id, "portal");
      if (response.success) {
        $scope.activedUser = response.data;
        $rootScope.isBusy = false;
        if (!$rootScope.isInRole("SuperAdmin")) {
          $scope.activedUser.roles = $scope.activedUser.roles.filter(
            (role) => role.description != "SuperAdmin"
          );
        }
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.loadMyProfile = async function () {
      $rootScope.isBusy = true;
      var response = await userServices.getMyProfile();
      if (response.success) {
        $scope.activedUser = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.loadUsers = async function (pageIndex) {
      authService.fillAuthData().then(() => {
        if ($rootScope.isInRoles(["SuperAdmin", "Admin"])) {
          $scope.createUrl = "/portal/user/create";
        }
      });

      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      $rootScope.isBusy = true;
      var resp = await userServices.getUsers($scope.request);
      if (resp && resp.success) {
        $scope.data = resp.data;
        if (!$rootScope.isInRole("SuperAdmin")) {
          $scope.data.items = $scope.data.items.filter(
            (user) =>
              user.roles.length == 0 || user.roles[0].role.name != "SuperAdmin"
          );
        }
        $.each($scope.data.items, function (i, user) {
          $.each($scope.data, function (i, e) {
            if (e.userId === user.id) {
              user.isHidden = true;
            }
          });
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

    $scope.removeUser = function (id) {
      $rootScope.showConfirm(
        $scope,
        "removeUserConfirmed",
        [id],
        null,
        "Remove User",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };

    $scope.removeUserConfirmed = async function (id) {
      $rootScope.isBusy = true;
      var result = await userServices.removeUser(id);
      if (result.success) {
        $scope.loadUsers();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.save = async function () {
      //if (user.avatar !== user.avatarUrl) {
      //    user.avatar = user.avatarUrl;
      //}
      $rootScope.isBusy = true;
      var resp = await userServices.saveUser($scope.activedUser);
      if (resp && resp.success) {
        $rootScope.showMessage("Update successfully!", "success");
        if (
          $scope.activedUser.user.id == authService.authentication.info.user.id
        ) {
          authService
            .refreshToken(
              authService.authentication.refreshToken,
              authService.authentication.accessToken
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

    $scope.saveUserData = async function () {
      if ($scope.activedUser.userData) {
        $scope.activedUser.userData.parentId = $scope.activedUser.id;
        $scope.activedUser.userData.parentType = "User";
        await dataService.save($scope.activedUser.userData);
      }
    };

    $scope.register = async function (user) {
      $rootScope.isBusy = true;
      var resp = await userServices.register(user);
      if (resp && resp.success) {
        $scope.activedUser = resp.data;
        $rootScope.showMessage("Update successfully!", "success");
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

    $scope.updateRoleStatus = async function (nav) {
      var userRole = {
        userId: nav.userId,
        roleId: nav.roleId,
        roleName: nav.description,
        isUserInRole: nav.isActived,
      };
      $rootScope.isBusy = true;
      var resp = await userServices.updateRoleStatus(userRole);
      if (resp && resp.success) {
        $rootScope.showMessage("Update successfully!", "success");
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
