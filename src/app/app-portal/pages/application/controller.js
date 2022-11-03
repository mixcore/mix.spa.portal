"use strict";
app.controller("MixApplicationController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "$routeParams",
  "MixApplicationRestService",
  "StoreService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $location,
    $routeParams,
    service,
    storeService
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
    BaseHub.call(this, $scope);
    $scope.progress = 0;
    $scope.viewMode = "list";
    $scope.current = null;
    $scope.themeRequest = angular.copy(ngAppSettings.request);
    $scope.themeRequest.orderBy = "createdDatetime";
    $scope.themeRequest.mixDatabaseName = "mixcorePortalApp";
    $scope.themeRequest.queries = [
      { fieldName: "mixcoreVersion", value: "2.0.1" },
    ];
    $scope.request.columns = [
      "id",
      "displayName",
      "baseRoute",
      "detailUrl",
      "createdDateTime",
      "createdBy",
    ];
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";

    $scope.init = async function () {
      $scope.startConnection("mixThemeHub", null, (err) => {
        console.log(err);
      });
      $scope.onConnected = () => {
        $scope.joinRoom("Theme");
      };
      await $scope.getThemes();
    };
    $scope.install = async function () {
      $rootScope.isBusy = true;
      $scope.installStatus = "Downloading";
      var resp = await service.install($scope.viewmodel);
      if (resp && resp.success) {
        $scope.data = resp.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.receiveMessage = function (resp) {
      let msg = JSON.parse(resp);
      switch (msg.action) {
        case "Downloading":
          var index = $scope.data.items.findIndex(
            (m) => m.id == $scope.current.id
          );
          var progress = Math.round(msg.message);
          if (index >= 0) {
            $scope.progress = progress;
            if (progress == 100) {
              $scope.installStatus = "Installing";
            }
            $scope.$apply();
          }
          break;

        default:
          console.log(msg);
          break;
      }
    };
    $scope.getThemes = async function () {
      $rootScope.isBusy = true;
      if ($scope.themeRequest.fromDate !== null) {
        var d = new Date($scope.themeRequest.fromDate);
        $scope.themeRequest.fromDate = d.toISOString();
      }
      if ($scope.themeRequest.toDate !== null) {
        var dt = new Date($scope.themeRequest.toDate);
        $scope.themeRequest.toDate = dt.toISOString();
      }
      var resp = await storeService.getThemes($scope.themeRequest);
      if (resp && resp.success) {
        $scope.data = resp.data;
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
    $scope.select = function (theme) {
      $scope.viewmodel.packateFilePath = theme.additionalData.source;
      $scope.current = theme;
      // TODO: verify user - theme to enable install
      $scope.current.canInstall = true;
      $scope.viewMode = "detail";
    };
    $scope.back = function () {
      $scope.viewMode = "list";
    };
  },
]);
