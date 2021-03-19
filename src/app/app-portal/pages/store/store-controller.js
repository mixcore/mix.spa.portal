﻿"use strict";
app.controller("StoreController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "StoreService",
  function ($scope, $rootScope, ngAppSettings, service) {
    $scope.categories = [];
    $scope.init = async function () {
      $scope.themeRequest = angular.copy(ngAppSettings.request);
      $scope.cateRequest = angular.copy(ngAppSettings.request);

      $scope.cateRequest.mixDatabaseName = "sys_category";
      $scope.cateRequest.pageSize = null;

      $scope.cates = ngAppSettings.enums.configuration_cates;
      $scope.settings = $rootScope.globalSettings;
      let getCategories = await service.getCategories($scope.cateRequest);
      $scope.categories = getCategories.data.items;
      await $scope.getThemes($scope.themeRequest);
      $scope.$apply();
    };

    $scope.getThemes = async function (pageIndex) {
      $rootScope.isBusy = true;
      if (pageIndex !== undefined) {
        $scope.themeRequest.pageIndex = pageIndex;
      }
      if ($scope.themeRequest.fromDate !== null) {
        var d = new Date($scope.themeRequest.fromDate);
        $scope.themeRequest.fromDate = d.toISOString();
      }
      if ($scope.themeRequest.toDate !== null) {
        var dt = new Date($scope.themeRequest.toDate);
        $scope.themeRequest.toDate = dt.toISOString();
      }
      var resp = await service.getThemes($scope.themeRequest);
      if (resp && resp.isSucceed) {
        $scope.data = resp.data;
        $.each($scope.data, function (i, data) {
          $.each($scope.viewmodels, function (i, e) {
            if (e.dataId === data.id) {
              data.isHidden = true;
            }
          });
        });
        if ($scope.getListSuccessCallback) {
          $scope.getListSuccessCallback();
        }
        if ($scope.isScrollTop) {
          $("html, body").animate({ scrollTop: "0px" }, 500);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        if ($scope.getListFailCallback) {
          $scope.getListFailCallback();
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
