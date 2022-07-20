"use strict";
app.controller("ThemeController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "ThemeService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    commonService
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
    $scope.exportData = null;
    $scope.exportThemeDto = {
      isIncludeAssets: true,
      isIncludeTemplates: true,
      isIncludeConfigurations: true,
      isIncludePermissions: true,
      cultureIds: [],
      content: {
        pageIds: [],
        pageContentIds: [],
        postIds: [],
        postContentIds: [],
        moduleIds: [],
        moduleContentIds: [],
        mixDatabaseIds: [],
      },
      associations: {
        pageIds: [],
        pageContentIds: [],
        postIds: [],
        postContentIds: [],
        moduleIds: [],
        moduleContentIds: [],
        mixDatabaseIds: [],
      },
    };

    $scope.getSingleSuccessCallback = function () {
      $scope.assets = null;
      $scope.theme = null;
    };

    $scope.syncTemplates = async function (id) {
      $rootScope.isBusy = true;
      var response = await service.syncTemplates(id);
      if (response.success) {
        $scope.viewmodel = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.export = async function () {
      $scope.exportThemeDto.themeId = $routeParams.id;
      $rootScope.isBusy = true;
      var response = await service.export($scope.exportThemeDto);

      if (response.success) {
        $rootScope.isBusy = false;
        window.open(response.data, "_blank");
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.saveSuccessCallback = function () {
      apiService.getAllSettings().then(function () {
        $location.path("/admin/theme/list");
        $rootScope.isBusy = false;
        $scope.$apply();
      });
    };
    $scope.removeCallback = function () {
      apiService.getAllSettings().then(function () {
        $location.path("/admin/theme/list");
      });
    };

    $scope.getExportData = async function () {
      var id = $routeParams.id;
      var resp = await service.getExportData(id);
      if (resp && resp.success) {
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

    $scope.generateSEO = function () {
      $scope.viewmodel.name = $rootScope.generateKeyword(
        $scope.viewmodel.title,
        "-"
      );
    };
  },
]);
