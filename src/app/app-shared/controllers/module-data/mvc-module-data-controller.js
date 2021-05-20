"use strict";
appShared.controller("MvcModuleDataController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "RestMvcModuleDataService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service
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
    $scope.request.orderBy = "Priority";
    $scope.request.direction = "Asc";
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.moduleId = null;
    $scope.module = null;
    $scope.allData = [];
    $scope.editDataUrl = null;
    $scope.canLoadMore = false;
    $scope.init = async function (moduleId, pageSize) {
      $scope.moduleId = moduleId;
      $scope.request.module_id = $scope.moduleId;
      $scope.request.pageSize = pageSize || $scope.request.pageSize;
      $scope.loadMore(0);
    };

    $scope.getSingle = async function () {
      $rootScope.isBusy = true;
      var resp = await service.getSingle($scope.id, "mvc");
      if (resp && resp.isSucceed) {
        $scope.activedModuleData = resp.data;
        $rootScope.initEditor();
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
    $scope.activeItem = function (arr, item) {
      angular.forEach(arr, function (e) {
        if (e.id != item.id) {
          e.expanded = false;
        } else {
          e.expanded = !e.expanded;
        }
      });
    };
    $scope.loadMore = async function (pageIndex) {
      $scope.request.pageIndex = pageIndex || $scope.request.pageIndex + 1;
      $rootScope.isBusy = true;
      var response = await service.getList($scope.request);
      if (response.isSucceed) {
        $scope.allData = $scope.allData.concat(response.data.items);
        $rootScope.isBusy = false;
        $scope.canLoadMore = response.data.totalItems > $scope.allData.length;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
