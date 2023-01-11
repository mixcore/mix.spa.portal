modules.component("relatedPosts", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/related-navigations/view.html",
  bindings: {
    title: "=",
    parentId: "=",
    parentType: "=",
    description: "=?",
    postTypes: "=?",
    mixDatabaseName: "=?",
    image: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "PostPostRestService",
    "PostRestService",
    function ($rootScope, $scope, ngAppSettings, service, postService) {
      var ctrl = this;
      ctrl.selected = null;
      ctrl.posts = {
        items: [],
      };
      ctrl.data = {
        items: [],
      };
      ctrl.$onInit = async () => {
        ctrl.request = angular.copy(ngAppSettings.request);
        ctrl.postRequest = angular.copy(ngAppSettings.request);
        ctrl.postRequest.searchColumns = "title,excerpt";
        if (ctrl.mixDatabaseName) {
          ctrl.postRequest.mixDatabaseName = ctrl.mixDatabaseName;
        }
        ctrl.postRequest.pageSize = 5;
        await ctrl.loadRelatedPosts();
        await ctrl.loadPosts();
      };
      ctrl.addRelatedPost = async (post) => {
        var tmp = ctrl.data.items.find(
          (m) => m.child.id == post.id || m.parentId == post.id
        );
        if (!tmp) {
          if (post) {
            let dto = {
              parentId: ctrl.parentId,
              childId: post.id,
            };
            var resp = await service.create(dto);
            if (resp.success) {
              $rootScope.showMessage("Success", "success");
              await ctrl.loadRelatedPosts();
              $rootScope.isBusy = false;
              $scope.$apply();
            } else {
              $rootScope.showErrors(resp.errors);
              $rootScope.isBusy = false;
              $scope.$apply();
            }
          }
        } else {
          $rootScope.showMessage(`${post.title} is existed`, "warning");
        }
      };

      ctrl.remove = function (id) {
        if (
          confirm(
            "Deleted data will not able to recover, are you sure you want to delete this item?"
          )
        ) {
          ctrl.removeConfirmed(id);
        }
      };

      ctrl.removeConfirmed = async function (id) {
        $rootScope.isBusy = true;
        var result = await service.delete([id]);
        if (result.success) {
          ctrl.loadRelatedPosts();
        } else {
          $rootScope.showErrors(result.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.loadPosts = async (pageIndex) => {
        $rootScope.isBusy = true;
        if (pageIndex !== undefined) {
          ctrl.postRequest.pageIndex = pageIndex;
        }
        if (ctrl.postRequest.fromDate !== null) {
          var d = new Date(ctrl.postRequest.fromDate);
          ctrl.postRequest.fromDate = d.toISOString();
        }
        if (ctrl.postRequest.toDate !== null) {
          var dt = new Date(ctrl.postRequest.toDate);
          ctrl.postRequest.toDate = dt.toISOString();
        }
        let getData = await postService.filter(ctrl.postRequest);
        if (getData.success) {
          ctrl.posts = getData.data;
          $rootScope.isBusy = false;
        } else {
          $rootScope.isBusy = false;
          $rootScope.showErrors(getData.errors);
        }
        $scope.$apply();
      };

      ctrl.loadRelatedPosts = async (pageIndex) => {
        if (ctrl.parentId) {
          $rootScope.isBusy = true;
          if (pageIndex !== undefined) {
            ctrl.request.pageIndex = pageIndex;
          }
          if (ctrl.request.fromDate !== null) {
            var d = new Date(ctrl.postRequest.fromDate);
            ctrl.request.fromDate = d.toISOString();
          }
          if (ctrl.request.toDate !== null) {
            var dt = new Date(ctrl.postRequest.toDate);
            ctrl.postRequest.toDate = dt.toISOString();
          }
          ctrl.request.parentId = ctrl.parentId;
          let getData = await service.search(ctrl.request);
          if (getData.success) {
            ctrl.data = getData.data;
            $rootScope.isBusy = false;
          } else {
            $rootScope.isBusy = false;
            $rootScope.showErrors(getData.errors);
          }
          $scope.$apply();
        }
      };
    },
  ],
});
