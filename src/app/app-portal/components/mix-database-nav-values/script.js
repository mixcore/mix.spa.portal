modules.component("mixDatabaseNavValues", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-nav-values/view.html",
  bindings: {
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    parentId: "=",
    parentType: "=",
    columns: "=?",
    header: "=",
    data: "=?",
    maxCol: "=?",
    createUrl: "=?",
    updateUrl: "=?",
    backUrl: "=?",
    onUpdate: "&?",
    onDelete: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestRelatedAttributeDataPortalService",
    "RestMixDatabaseColumnPortalService",
    function ($rootScope, $scope, ngAppSettings, navService, columnService) {
      var ctrl = this;
      ctrl.selectedProp = null;
      ctrl.request = angular.copy(ngAppSettings.restRequest);
      ctrl.request.orderBy = "Priority";
      ctrl.request.query = "{}";

      ctrl.request.direction = 0;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        ctrl.maxCol = ctrl.maxCol || 3;
        if (!ctrl.columns) {
          var getFields = await columnService.initData(
            ctrl.mixDatabaseName || ctrl.mixDatabaseId
          );
          if (getFields.isSucceed) {
            ctrl.columns = getFields.data;
            ctrl.mixDatabaseTitle = ctrl.columns[0].mixDatabaseName;
            ctrl.mixDatabaseName = ctrl.columns[0].mixDatabaseName;
            ctrl.mixDatabaseId = ctrl.columns[0].mixDatabaseId;
            $scope.$apply();
          }
        }
        if (!ctrl.data) {
          ctrl.loadData();
        }
        ctrl.buildCreateUrl();
      };
      ctrl.buildCreateUrl = function () {
        var backUrl = encodeURI(
          `/portal/mix-database-data/details?dataId=${ctrl.parentId}`
        );
        ctrl.createUrl = `/portal/mix-database-data/create?mixDatabaseId=${ctrl.mixDatabaseId}&dataId=default&parentId=${ctrl.parentId}&parentType=Set&mixDatabaseTitle=${ctrl.mixDatabaseTitle}&backUrl=${backUrl}`;
      };
      ctrl.update = function (data) {
        ctrl.onUpdate({ data: data });
      };

      ctrl.delete = function (data) {
        ctrl.onDelete({ data: data });
      };

      ctrl.filterData = function (item, attributeName) {
        return $rootScope.findObjectByKey(
          item.data,
          "attributeName",
          attributeName
        );
      };

      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.data.items[0].priority;
      };
      ctrl.updateOrders = function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.data.items.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.data.items.splice(ctrl.dragStartIndex + 1, 1);
        }
        angular.forEach(ctrl.data.items, function (e, i) {
          e.priority = ctrl.minPriority + i;
          navService.saveFields(e.id, { priority: e.priority }).then((resp) => {
            $rootScope.isBusy = false;
            $scope.$apply();
          });
        });
      };

      ctrl.loadData = function () {
        ctrl.request.mixDatabaseId = ctrl.mixDatabaseId || 0;
        ctrl.request.mixDatabaseName = ctrl.mixDatabaseName || null;
        ctrl.request.parentId = ctrl.parentId;
        ctrl.request.parentType = ctrl.parentType;
        navService.getList(ctrl.request).then((resp) => {
          if (resp) {
            ctrl.data = resp.data;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors("Failed");
            }
            ctrl.refData = [];
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        });
      };
      ctrl.updateData = function (nav) {
        var backUrl = encodeURI(
          `/portal/mix-database-data/details?dataId=${ctrl.parentId}`
        );
        $rootScope.goToPath(
          `${ctrl.updateUrl}?dataId=${nav.dataId}&mixDatabaseId=${nav.mixDatabaseId}&parentId=${ctrl.parentId}&parentType=${ctrl.parentType}&backUrl=${backUrl}`
        );
        // ctrl.refDataModel = nav;
        // var e = $(".pane-form-" + ctrl.mixDatabaseDataValue.column.referenceId)[0];
        // angular.element(e).triggerHandler('click');
        // $location.url('/portal/mix-database-data/details?dataId='+ item.id +'&mixDatabaseId=' + item.mixDatabaseId+'&parentType=' + item.parentType+'&parentId=' + item.parentId);
      };
      ctrl.saveData = function (data) {
        $rootScope.isBusy = true;
        ctrl.refDataModel.data = data;
        dataService.save("portal", data).then((resp) => {
          if (resp.isSucceed) {
            ctrl.refDataModel.id = resp.data.id;
            ctrl.refDataModel.data = resp.data;
            navService.save("portal", ctrl.refDataModel).then((resp) => {
              if (resp.isSucceed) {
                var tmp = $rootScope.findObjectByKey(
                  ctrl.refData,
                  ["parentId", "parentType", "id"],
                  [resp.data.parentId, resp.data.parentType, resp.data.id]
                );
                if (!tmp) {
                  ctrl.refData.push(resp.data);
                }
                ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
                var e = $(
                  ".pane-data-" + ctrl.mixDatabaseDataValue.column.referenceId
                )[0];
                angular.element(e).triggerHandler("click");
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
          $rootScope.removeObjectByKey(ctrl.data.items, "id", nav.id);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.view = function (item) {
        var obj = {
          columns: ctrl.columns,
          item: item,
        };
        $rootScope.preview("mix-database-data", obj, null, "modal-lg");
      };
    },
  ],
});
