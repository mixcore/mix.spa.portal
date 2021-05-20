"use strict";
appShared.controller("MvcPostController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "BaseService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    baseService
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
    $scope.service = null;
    $scope.request.orderBy = "Priority";
    $scope.request.direction = "Asc";
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.moduleId = null;
    $scope.module = null;
    $scope.allData = [];
    $scope.editDataUrl = null;
    $scope.canLoadMore = false;
    $scope.init = async function (type, parentId, pageSize) {
      $scope.parentId = parentId; // page / post
      $scope.service = Object.create(baseService);
      if (type.toLowerCase() === "page") {
        $scope.service.init("page-post/mvc");
      } else if (type.toLowerCase() === "page") {
        $scope.service.init("module-post/mvc");
      }

      $scope.request.module_id = $scope.moduleId;
      $scope.request.pageSize = pageSize || $scope.request.pageSize;
      $scope.loadMore(0);
    };

    $scope.loadMore = async function (pageIndex) {
      $scope.request.pageIndex = pageIndex || $scope.request.pageIndex + 1;
      $rootScope.isBusy = true;
      var response = await service.getList($scope.request);
      if (response.isSucceed) {
        $scope.allData = $scope.allData.concat(response.data.items);
        $rootScope.isBusy = false;
        $scope.canLoadMore =
          response.data.totalItems >
          response.data.page * response.data.pageSize;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
