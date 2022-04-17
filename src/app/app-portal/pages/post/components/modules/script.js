app.component("postModules", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/modules/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "SharedModuleDataService",
    function ($rootScope, $scope, ngAppSettings, moduleDataService) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.translate = function (keyword, wrap, defaultValue) {
        return $rootScope.translate(keyword, wrap, defaultValue);
      };

      ctrl.removeData = function (id, moduleContentId) {
        $rootScope.showConfirm(
          ctrl,
          "removeDataConfirmed",
          [id, moduleContentId],
          null,
          "Remove Data",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };
      ctrl.removeDataConfirmed = async function (id, moduleContentId) {
        $rootScope.isBusy = true;
        var result = await moduleDataService.removeModuleData(id);
        if (result.success) {
          ctrl.loadModuleDatas(moduleContentId);
        } else {
          $rootScope.showErrors(result.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.saveDataCallback = function (data) {
        if (data) {
          ctrl.loadModuleDatas(data.moduleContentId);
        }
      };
      ctrl.loadModuleDatas = async function (id, pageIndex) {
        $rootScope.isBusy = true;
        $scope.dataColumns = [];
        var request = angular.copy(ngAppSettings.request);
        request.query = "?moduleContentId=" + id + "&post_id=" + ctrl.post.id;
        if (pageIndex) {
          request.pageIndex = pageIndex;
        }
        var response = await moduleDataService.getModuleDatas(request);
        if (response.success) {
          var nav = $rootScope.findObjectByKey(
            ctrl.post.moduleNavs,
            "moduleContentId",
            id
          );
          if (nav) {
            nav.module.data = response.data;
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.updateDataInfos = async function (items) {
        $rootScope.isBusy = true;
        var resp = await moduleDataService.updateInfos(items);
        if (resp && resp.success) {
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
  ],
  bindings: {
    post: "=",
    onDelete: "&",
    onUpdate: "&",
  },
});
