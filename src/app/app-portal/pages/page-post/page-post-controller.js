"use strict";
app.controller("PagePostController", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$routeParams",
  "$location",
  "PagePostRestService",
  "PostRestService",
  "ApiService",
  "CommonService",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $routeParams,
    $location,
    service,
    postService,
    commonService
  ) {
    BaseCtrl.call(
      this,
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      service
    );
    $scope.cates = ["Site", "System"];
    $scope.others = [];
    $scope.localizeSettings = $rootScope.globalSettings;
    $scope.init = function () {
      $scope.pageId = $routeParams.id;
      $scope.type = $routeParams.type || "";
      $scope.template = $routeParams.template || "";
      $scope.pageIds = $routeParams.page_ids || $routeParams.id || "";
      $scope.moduleIds = $routeParams.module_ids || "";
      $scope.canDrag =
        $scope.request.orderBy === "Priority" &&
        $scope.request.direction === "Asc";
      $scope.createUrl =
        $routeParams.post_type === "gallery"
          ? "/portal/post/create-gallery"
          : `/portal/post/create?page_ids=${$scope.pageIds}&module_ids=${$scope.moduleIds}&type=${$scope.type}&template=${$scope.template}`;
      $scope.updateUrl =
        $routeParams.post_type === "gallery"
          ? "/portal/post/gallery-details"
          : "/portal/post/details";
    };
    $scope.getList = async function (pageIndex) {
      if (pageIndex !== undefined) {
        $scope.request.pageIndex = pageIndex;
      }
      $rootScope.isBusy = true;
      var id = $routeParams.id;
      $scope.request.query = "&page_id=" + id;
      var response = await service.getList($scope.request);
      $scope.canDrag =
        $scope.request.orderBy === "Priority" &&
        $scope.request.direction === "Asc";
      if (response.isSucceed) {
        $scope.data = response.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.preview = function (item) {
      item.editUrl = "/portal/post/details/" + item.id;
      $rootScope.preview("post", item, item.title, "modal-lg");
    };
    $scope.remove = function (pageId, postId) {
      $rootScope.showConfirm(
        $scope,
        "removeConfirmed",
        [pageId, postId],
        null,
        "Remove",
        "Deleted data will not able to recover, are you sure you want to delete this item?"
      );
    };
    $scope.back = function () {
      window.history.back();
    };

    $scope.removeConfirmed = async function (id) {
      $rootScope.isBusy = true;
      var result = await service.delete(id);
      if (result.isSucceed) {
        if ($scope.removeCallback) {
          $rootScope.executeFunctionByName(
            "removeCallback",
            $scope.removeCallbackArgs,
            $scope
          );
        }
        $scope.getList();
      } else {
        $rootScope.showMessage("failed");
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.saveOthers = async function () {
      var response = await service.saveList($scope.others);
      if (response.isSucceed) {
        $scope.getList();
        $scope.$apply();
      } else {
        $rootScope.showErrors(response.errors);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateInfos = async function (index) {
      $scope.data.items.splice(index, 1);
      $rootScope.isBusy = true;
      var startIndex = $scope.data.items[0].priority - 1;
      for (var i = 0; i < $scope.data.items.length; i++) {
        $scope.data.items[i].priority = startIndex + i + 1;
      }
      var resp = await service.updateInfos($scope.data.items);
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
  },
]);
