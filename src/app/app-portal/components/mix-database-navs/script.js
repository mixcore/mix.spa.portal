modules.component("mixDatabaseNavs", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-navs/view.html",
  bindings: {
    parentId: "=",
    parentType: "=",
    mixDatabaseNavs: "=?",
    onUpdate: "&?",
    onDelete: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestRelatedMixDatabasePortalService",
    "RestMixDatabasePortalService",
    function ($rootScope, $scope, ngAppSettings, navService, setService) {
      var ctrl = this;
      ctrl.mixDatabaseNavs = ctrl.mixDatabaseNavs || [];
      ctrl.selected = {};
      ctrl.defaultData = null;
      ctrl.navRequest = angular.copy(ngAppSettings.request);
      ctrl.setRequest = angular.copy(ngAppSettings.request);

      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = function () {
        // ctrl.setRequest.type = ctrl.parentType;
        navService.getDefault().then((resp) => {
          resp.parentId = ctrl.parentId;
          resp.parentType = ctrl.parentType;
          ctrl.defaultData = resp;
          ctrl.loadData();
        });
      };
      ctrl.goToPath = $rootScope.goToPath;
      ctrl.selectPane = function (pane) {};
      ctrl.loadData = async function () {
        // Load attr set navs if not in input
        if (!ctrl.mixDatabaseNavs) {
          ctrl.navRequest.parentType = ctrl.parentType;
          ctrl.navRequest.parentId = ctrl.parentId;
          var resp = await navService.getList(ctrl.navRequest);
          if (resp) {
            angular.forEach(resp.data.items, (e) => {
              e.isActived = true;
              ctrl.mixDatabaseNavs.push(e);
            });
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
            }
          }
        } else {
          angular.forEach(ctrl.mixDatabaseNavs, (e) => {
            e.isActived = true;
          });
        }

        var setResult = await setService.getList(ctrl.setRequest);
        if (setResult) {
          angular.forEach(setResult.data.items, (element) => {
            var e = $rootScope.findObjectByKey(
              ctrl.mixDatabaseNavs,
              "mixDatabaseId",
              element.id
            );
            if (!e) {
              e = angular.copy(ctrl.defaultData);
              e.status = "Published";
              e.mixDatabaseId = element.id;
              e.specificulture = navService.lang;
              e.data = element;
              e.isActived = false;
              ctrl.mixDatabaseNavs.push(e);
            }
          });
        } else {
          if (setResult) {
            $rootScope.showErrors("Others Failed");
          }
        }
        $scope.$apply();
      };
      ctrl.change = async function (nav) {
        $rootScope.isBusy = true;
        var result;
        if (nav.isActived) {
          ctrl.active(nav);
        } else {
          ctrl.deactive(nav);
        }
      };

      ctrl.deactive = async function (nav) {
        let result = null;
        if (nav.id) {
          result = await navService.delete([nav.id]);
          $(".pane-container-" + nav.data.id)
            .parent()
            .remove();
        }
        if (result && result.isSucceed) {
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
        }
      };

      ctrl.active = async function (nav) {
        $rootScope.isBusy = true;
        var result;
        result = await navService.save(nav);
        if (result && result.isSucceed) {
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.update = function (data) {
        ctrl.onUpdate({
          data: data,
        });
      };

      ctrl.delete = function (data) {
        ctrl.onDelete({
          data: data,
        });
      };

      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.mixDatabaseNavs[0].priority;
      };
      ctrl.updateOrders = function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.mixDatabaseNavs.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.mixDatabaseNavs.splice(ctrl.dragStartIndex + 1, 1);
        }
        var arrNavs = [];
        angular.forEach(ctrl.mixDatabaseNavs, function (e, i) {
          e.priority = ctrl.minPriority + i;
          var keys = {
            parentId: e.parentId,
            parentType: e.parentType,
            id: e.id,
          };
          var properties = {
            priority: e.priority,
          };
          arrNavs.push({
            keys: keys,
            properties: properties,
          });
        });
        navService.saveProperties("portal", arrNavs).then((resp) => {
          $rootScope.isBusy = false;
          $scope.$apply();
        });
      };
    },
  ],
});
