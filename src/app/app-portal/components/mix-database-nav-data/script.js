modules.component("mixDatabaseNavData", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-nav-data/view.html",
  bindings: {
    nav: "=",
    parentId: "=",
    parentType: "=",
    onUpdate: "&?",
    onDelete: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestRelatedAttributeDataPortalService",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, ngAppSettings, navService, dataService) {
      var ctrl = this;
      ctrl.data = null;
      ctrl.selected = null;
      ctrl.navRequest = angular.copy(ngAppSettings.request);
      ctrl.setRequest = angular.copy(ngAppSettings.request);
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = function () {
        navService
          .getDefault([ctrl.parentId, ctrl.parentType, "default"])
          .then((resp) => {
            ctrl.defaultData = resp.data;
            ctrl.defaultData.parentId = ctrl.parentId;
            ctrl.defaultData.parentType = ctrl.parentType;
            ctrl.selected = angular.copy(ctrl.defaultData);
            ctrl.loadData();
          });
        ctrl.navRequest.parentType = ctrl.parentType;
        ctrl.navRequest.parentId = ctrl.parentId;
      };
      ctrl.selectPane = function (pane) {};
      ctrl.loadData = function () {
        navService.getList(ctrl.navRequest).then((resp) => {
          if (resp) {
            ctrl.data = resp.data;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors("Failed");
            }
            $scope.$apply();
          }
        });
      };
      ctrl.updateData = function (nav) {
        ctrl.selected = nav;
        var e = $(".pane-form-" + ctrl.nav.data.id)[0];
        angular.element(e).triggerHandler("click");
        // $location.url('/portal/mix-database-data/details?dataId='+ item.id +'&mixDatabaseId=' + item.mixDatabaseId+'&parentType=' + item.parentType+'&parentId=' + item.parentId);
      };
      ctrl.saveData = function (data) {
        $rootScope.isBusy = true;
        ctrl.selected.data = data;
        dataService.save(data).then((resp) => {
          if (resp.isSucceed) {
            ctrl.selected.dataId = resp.data.id;
            ctrl.selected.mixDatabaseId = resp.data.mixDatabaseId;
            ctrl.selected.mixDatabaseName = resp.data.mixDatabaseName;
            ctrl.selected.attributeData = resp.data;
            navService.save(ctrl.selected).then((resp) => {
              if (resp.isSucceed) {
                var tmp = $rootScope.findObjectByKey(
                  ctrl.data,
                  ["parentId", "parentType", "id"],
                  [resp.data.parentId, resp.data.parentType, resp.data.id]
                );
                if (!tmp) {
                  ctrl.data.items.push(resp.data);
                  var e = $(".pane-data-" + ctrl.nav.data.id)[0];
                  angular.element(e).triggerHandler("click");
                }
                ctrl.selected = angular.copy(ctrl.defautData);
                $rootScope.isBusy = false;
                $scope.$apply();
              } else {
                $rootScope.showMessage("failed");
                $rootScope.isBusy = false;
                $scope.$apply();
              }
            });
          } else {
            $rootScope.showMessage("failed");
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        });
      };
      ctrl.removeData = async function (nav) {
        $rootScope.showConfirm(
          ctrl,
          "removeDataConfirmed",
          [nav],
          null,
          "Remove",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };
      ctrl.removeDataConfirmed = async function (nav) {
        $rootScope.isBusy = true;
        var result = await navService.delete([nav.id]);
        if (result.isSucceed) {
          $rootScope.removeObjectByKey(ctrl.data, "id", nav.id);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.data[0].priority;
      };
      ctrl.updateOrders = function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.data.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.data.splice(ctrl.dragStartIndex + 1, 1);
        }
        var arrNavs = [];
        angular.forEach(ctrl.data, function (e, i) {
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
