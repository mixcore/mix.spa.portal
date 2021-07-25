modules.component("modalNavPosts", {
  templateUrl:
    "/mix-app/views/app-portal/components/modal-nav-posts/modal-nav-posts.html",
  bindings: {
    srcColumn: "=",
    srcId: "=",
    query: "=",
    selected: "=",
    save: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    "ngAppSettings",
    "PostRestService",
    function ($rootScope, $scope, $routeParams, ngAppSettings, postService) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.navs = [];
      ctrl.data = { items: [] };
      ctrl.loadPosts = async function (pageIndex) {
        // ctrl.request.query = ctrl.query + ctrl.srcId;
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var d = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = d.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var d = new Date(ctrl.request.toDate);
          ctrl.request.toDate = d.toISOString();
        }
        if ($routeParams.type) {
          ctrl.request.postType = $routeParams.type;
        } else {
          ctrl.request.postType = "";
        }
        var response = await postService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          ctrl.navs = [];
          angular.forEach(response.data.items, function (e) {
            var item = {
              priority: e.priority,
              description: e.title,
              postId: e.id,
              image: e.thumbnailUrl,
              specificulture: e.specificulture,
              post: e,
              status: "Published",
              isActived: false,
            };
            item[ctrl.srcColumn] = ctrl.srcId;
            ctrl.navs.push(item);
          });
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.saveSelected = function () {
        ctrl.selected = $rootScope.filterArray(
          ctrl.navs,
          ["isActived"],
          [true]
        );
        setTimeout(() => {
          ctrl.save().then(() => {
            ctrl.loadPosts();
          });
        }, 500);
      };
    },
  ],
});
