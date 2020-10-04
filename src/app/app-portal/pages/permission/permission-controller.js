"use strict";
app.controller("PermissionController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "CommonService",
  "PermissionService",
  "RestPortalPageNavigationService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    commonService,
    service,
    navService
  ) {
    BaseRestCtrl.call(
      this,
      $scope,
      $rootScope,
      $location,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.request.level = 0;
    $scope.miOptions = ngAppSettings.miIcons;

    $scope.initCurrentPath = async function () {
      var resp = await service.getDefault();
      if (resp && resp.isSucceed) {
        $scope.activedData = resp.data;
        $scope.activedData.url = $location.path();
        $rootScope.isBusy = false;
        $scope.$applyAsync();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors);
        }
        if ($scope.getSingleFailCallback) {
          $scope.getSingleFailCallback();
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveSuccessCallback = function () {
      $scope.getSingle();
    };

    $scope.updateInfos = async function (items) {
      $rootScope.isBusy = true;
      var resp = await service.updateInfos(items);
      if (resp && resp.isSucceed) {
        $scope.activedPage = resp.data;
        $rootScope.showMessage("success", "success");
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

    $scope.updateChildInfos = async function (items) {
      $rootScope.isBusy = true;
      var resp = await service.updateChildInfos(items);
      if (resp && resp.isSucceed) {
        $scope.activedPage = resp.data;
        $rootScope.showMessage("success", "success");
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
    $("#dlg-favorite").on("show.bs.modal", function (event) {
      $scope.initCurrentPath();
    });
  },
]);
