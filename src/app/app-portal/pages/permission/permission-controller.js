﻿"use strict";
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

    $scope.dragStart = function (index) {
      $scope.minPriority = $scope.data.items[0].priority;
      $scope.dragStartIndex = index;
    };
    $scope.updateOrders = function (index) {
        if (index > $scope.dragStartIndex) {
          $scope.data.items.splice($scope.dragStartIndex, 1);
        } else {
          $scope.data.items.splice($scope.dragStartIndex + 1, 1);
        }
        angular.forEach($scope.data.items, function (e, i) {
          e.priority = $scope.minPriority + i;
          service.saveFields(e.id, { priority: e.priority }).then((resp) => {
            $rootScope.isBusy = false;
            $scope.$apply();
          });
        });
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
