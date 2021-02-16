﻿"use strict";
app.controller("ThemeController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ThemeService",
  "CommonService",
  function($scope, $rootScope, ngAppSettings, $routeParams, $location, service,
           commonService) {
    BaseCtrl.call(this, $scope, $rootScope, $routeParams, ngAppSettings,
                  service);
    $scope.exportData = null;
    $scope.selectedExport = {
      pages : [],
      modules : [],
      mixDatabases : [],
    };

    $scope.getSingleSuccessCallback = function() {
      $scope.assets = null;
      $scope.theme = null;
    };
    $scope.save = async function(viewModel) {
      var form = document.getElementById("form-portal");
      var frm = new FormData();
      var url = service.prefixUrl + "/save";

      $rootScope.isBusy = true;
      // Looping over all files and add it to FormData object
      frm.append("assets", form["assets"].files[0]);
      frm.append("theme", form["theme"].files[0]);
      // Adding one more key to FormData object
      frm.append("model", angular.toJson(viewModel || $scope.viewModel));

      var response = await service.ajaxSubmitForm(frm, url);
      if (response.isSucceed) {
        $scope.viewModel = response.data;
        $rootScope.isBusy = false;
        $location.url($scope.referrerUrl);
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.syncTemplates = async function(id) {
      $rootScope.isBusy = true;
      var response = await service.syncTemplates(id);
      if (response.isSucceed) {
        $scope.viewModel = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.export = async function() {
      var id = $routeParams.id;
      $rootScope.isBusy = true;
      var response = await service.export(id, $scope.selectedExport);
      if (response.isSucceed) {
        $rootScope.isBusy = false;
        window.open(response.data, "_blank");
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveSuccessCallback = function() {
      commonService.initAllSettings().then(function() {
        $location.path("/portal/theme/list");
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };
    $scope.removeCallback = function() {
      commonService.initAllSettings().then(
          function() { $location.path("/portal/theme/list"); });
    };

    $scope.getExportData = async function() {
      var id = $routeParams.id;
      var resp = await service.getExportData(id);
      if (resp && resp.isSucceed) {
        $scope.exportData = resp.data;
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

    $scope.generateSEO = function() {
      $scope.viewModel.name =
          $rootScope.generateKeyword($scope.viewModel.title, "-");
    };
  },
]);
