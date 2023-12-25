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
    $scope.host = `${$rootScope.globalSettings.domain}/${$scope.host}`;
    $scope.progress = 0;
    $scope.viewMode = "list";
    $scope.current = null;
    $scope.themeRequest = angular.copy(ngAppSettings.request);
    $scope.themeRequest.orderBy = "createdDatetime";
    $scope.themeRequest.mixDatabaseName = "mixApplicationPackage";
    $scope.themeRequest.queries = [
      { fieldName: "mixcoreVersion", value: "2.0.1" },
    ];
    $scope.request.columns = [
      "id",
      "displayName",
      "baseHref",
      "detailUrl",
      "createdDateTime",
      "createdBy",
    ];
    $scope.canDrag =
      $scope.request.orderBy !== "Priority" || $scope.request.direction !== "0";

    $scope.generateBaseHref = (forceRename) => {
      if (
        forceRename ||
        ($scope.viewmodel.displayName && !$scope.viewmodel.baseHref)
      ) {
        $scope.viewmodel.baseHref = `/app/${$rootScope.generateKeyword(
          $scope.viewmodel.displayName,
          "-",
          false,
          true
        )}`;
      }
    };
    $scope.init = async function () {
      $scope.startConnection("mixThemeHub", null, (err) => {
        console.log(err);
      });
      $scope.onConnected = () => {
        $scope.joinRoom("Theme");
      };
      if (!$scope.viewmodel.id) {
        await $scope.getThemes();
      }
    };
    $scope.install = async function () {
      $rootScope.isBusy = true;
      $scope.installStatus = "Downloading";
      var resp = await service.install($scope.viewmodel);
      if (resp && resp.success) {
        $rootScope.isBusy = false;
        $("html, body").animate({ scrollTop: "0px" }, 500);
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.restore = async function () {
      $rootScope.isBusy = true;
      $scope.installStatus = "Restoring";
      $("html, body").animate({ scrollTop: "0px" }, 500);
      var resp = await service.restore({
        appId: $scope.viewmodel.id,
        packageFilePath: $scope.viewmodel.appSettings.activePackage,
      });
      if (resp && resp.success) {
        $scope.data = resp.data;
        $rootScope.isBusy = false;
        $scope.installStatus = "Finished";
        $scope.status = "";
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.installStatus = "";
        $scope.status = "";
        $scope.$apply();
      }
    };
    $scope.receiveMessage = function (msg) {
      switch (msg.action) {
        case "Downloading":
          var index = $scope.data.items.findIndex(
            (m) => m.id == $scope.current.id
          );
          var progress = Math.round(msg.message);
          if (index >= 0) {
            $scope.progress = progress;
            $scope.$apply();
          }
          break;
        case "Finished":
          $scope.installStatus = "Finished";
          $location.url("/admin/mix-application/list");
          $scope.$apply();
          break;
        default:
          setTimeout(() => {
            $scope.status = msg.message;
            $scope.$apply();
          }, 200);
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
      $scope.viewmodel.packageFilePath = theme.additionalData.builtSourceCode;
      $scope.viewmodel.displayName = theme.additionalData.title;
      $scope.generateBaseHref(true);
      $scope.current = theme;
      // TODO: verify user - theme to enable install
      $scope.current.canInstall = true;
      $scope.viewMode = "detail";
    };
    $scope.back = function () {
      $scope.viewMode = "list";
    };
    $scope.validate = function () {
      if ($scope.viewmodel.baseHref.indexOf("/mixapp/") != 0) {
        $rootScope.showErrors(['baseHref must start with "/mixapp/"']);
        return false;
      }
      return true;
    };
    $scope.updateAppSettings = (data) => {
      $scope.viewmodel.appSettings = data;
    };
  },
]);
