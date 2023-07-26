modules.component("mixDatabaseDataValues", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-data-values/view.html",
  bindings: {
    database: "=?",
    mixDatabaseName: "=?",
    mixDatabaseTitle: "=?",
    mixDatabaseId: "=?",
    parentName: "=?",
    parentId: "=?",
    guidParentId: "=?",
    header: "=?",
    data: "=?",
    canDrag: "=?",
    queries: "=?",
    filterType: "=?",
    compareType: "=?",
    selectedList: "=?",
    selectSingle: "=?",
    database: "=?",
    onFilterList: "&?",
    onApplyList: "&?",
    onSendMail: "&?",
    onUpdate: "&?",
    onDuplicate: "&?",
    onDelete: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "ngAppSettings",
    "RestMixDatabasePortalService",
    "MixDbService",
    function (
      $rootScope,
      $scope,
      $location,
      $routeParams,
      ngAppSettings,
      databaseService,
      dataService
    ) {
      var ctrl = this;
      ctrl.intShowColumn = 3;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.actions = ["Delete", "SendMail"];
      ctrl.filterTypes = ["contain", "equal"];
      ctrl.compareTypes = ["or", "and"];
      ctrl.selectedProp = null;
      ctrl.mixConfigurations = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        dataService.initDbName(ctrl.mixDatabaseName);
        ctrl.request.name = ctrl.mixDatabaseName;
        ctrl.request.parentName = ctrl.parentName;
        ctrl.request.parentId = ctrl.parentId;
        ctrl.request.guidParentId = ctrl.guidParentId;
        if (!ctrl.selectedList) {
          ctrl.selectedList = {
            action: "Delete",
            data: [],
          };
        }
        if (!ctrl.database) {
          var getDatabase = await databaseService.getByName(
            ctrl.mixDatabaseName
          );
          if (getDatabase.success) {
            ctrl.database = getDatabase.data;
            $scope.$apply();
          }
        }
        if (!ctrl.data) {
          await ctrl.loadData();
        }
        ctrl.createUrl = `/admin/mix-database-data/create?mixDatabaseId=${
          ctrl.database.id
        }&mixDatabaseName=${ctrl.database.systemName}&mixDatabaseTitle=${
          ctrl.database.displayName
        }&dataContentId=default&guidParentId=${
          ctrl.guidParentId || ""
        }&parentId=${ctrl.parentId || ""}&parentName=${ctrl.parentName || ""}`;
        $scope.$apply();
      };
      ctrl.loadData = async function () {
        dataService.initDbName(ctrl.mixDatabaseName);
        ctrl.request.queries = [];
        if (ctrl.queries) {
          Object.keys(ctrl.queries).forEach((e) => {
            if (ctrl.queries[e]) {
              ctrl.request.queries.push({
                fieldName: e,
                value: ctrl.queries[e],
              });
            }
          });
        }
        var getData = await dataService.filter(ctrl.request);
        ctrl.data = getData.data;
        ctrl.selectedIds = ctrl.data.items.map((m) => m.id);
        $scope.$apply();
      };
      ctrl.select = function (item) {
        if (item.isSelected) {
          if (ctrl.selectSingle == "true") {
            ctrl.selectedList.data.items = [];
            ctrl.selectedList.data.items.push(item);
          } else {
            var current = $rootScope.findObjectByKey(
              ctrl.selectedList,
              "id",
              item.id
            );
            if (!current) {
              ctrl.selectedList.data.items.push(item);
            }
          }
        } else {
          $rootScope.removeObject(ctrl.selectedList, item.id);
        }
      };
      ctrl.selectAll = function (isSelected) {
        ctrl.selectedList.data.items = [];
        angular.forEach(ctrl.data.items, function (e) {
          e.isSelected = isSelected;
          if (isSelected) {
            ctrl.selectedList.data.items.push(e.id);
          }
        });
      };
      ctrl.filter = function () {
        ctrl.data.items = [];
        ctrl.loadData();
      };
      ctrl.sendMail = async function (data) {
        ctrl.onSendMail({ data: data });
      };
      ctrl.apply = async function () {
        ctrl.onApplyList();
      };

      ctrl.duplicate = function (data) {
        ctrl.onDuplicate({ data: data });
      };

      ctrl.update = function (data) {
        let url = `/admin/mix-database-data/details?dataContentId=${
          data.id
        }&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${
          ctrl.mixDatabaseTitle
        }&guidParentId=${ctrl.guidParentId || ""}&parentId=${
          ctrl.parentId || ""
        }&parentName=${ctrl.parentName || ""}`;
        $location.url(url);
      };

      ctrl.delete = function (data) {
        $rootScope.showConfirm(
          ctrl,
          "removeConfirmed",
          [data.id],
          null,
          "Remove",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };

      ctrl.removeConfirmed = async function (dataContentId) {
        $rootScope.isBusy = true;
        var result = await dataService.delete([dataContentId]);
        if (result.success) {
          if (ctrl.onDelete) {
            ctrl.onDelete({ data: dataContentId });
          }
          await ctrl.loadData();
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(result.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.filterData = function (item, attributeName) {
        return $rootScope.findObjectByKey(
          item.data.items,
          "attributeName",
          attributeName
        );
      };

      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.data.items[0].priority;
      };
      ctrl.updateOrders = function (index, items) {
        if (index > ctrl.dragStartIndex) {
          ctrl.data.items.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.data.items.splice(ctrl.dragStartIndex + 1, 1);
        }
        ctrl.updateDataInfos();
      };
      ctrl.updateDataInfos = async function () {
        angular.forEach(ctrl.data.items, async function (e, i) {
          e.priority = ctrl.minPriority + i;
          var resp = await dataService.saveFields(e.id, {
            priority: e.priority,
          });
          if (resp && resp.success) {
            $scope.activedPage = resp.data;
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
            }
          }
        });
      };

      ctrl.view = function (item) {
        var obj = {
          columns: ctrl.database.columns,
          item: item,
        };
        $rootScope.preview("mix-database-data", obj, null, "modal-lg");
      };
    },
  ],
});
