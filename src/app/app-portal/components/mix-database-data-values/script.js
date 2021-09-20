modules.component("mixDatabaseDataValues", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-data-values/view.html",
  bindings: {
    header: "=",
    data: "=",
    canDrag: "=",
    mixDatabaseName: "=?",
    mixDatabaseTitle: "=?",
    mixDatabaseId: "=?",
    queries: "=?",
    filterType: "=?",
    compareType: "=?",
    selectedList: "=",
    selectSingle: "=?",
    columns: "=?",
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
    "RestMixDatabaseColumnPortalService",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, columnService, dataService) {
      var ctrl = this;
      ctrl.actions = ["Delete", "SendMail"];
      ctrl.filterTypes = ["contain", "equal"];
      ctrl.compareTypes = ["or", "and"];
      ctrl.selectedProp = null;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        if (!ctrl.selectedList) {
          ctrl.selectedList = {
            action: "Delete",
            data: [],
          };
        }
        if (!ctrl.columns) {
          var getFields = await columnService.initData(
            ctrl.mixDatabaseName || ctrl.mixDatabaseId
          );
          if (getFields.isSucceed) {
            ctrl.columns = getFields.data;
            $scope.$apply();
          }
        }
      };
      ctrl.select = function (item) {
        if (item.isSelected) {
          if (ctrl.selectSingle == "true") {
            ctrl.selectedList.data = [];
            ctrl.selectedList.data.push(item);
          } else {
            var current = $rootScope.findObjectByKey(
              ctrl.selectedList,
              "id",
              item.id
            );
            if (!current) {
              ctrl.selectedList.data.push(item);
            }
          }
        } else {
          $rootScope.removeObject(ctrl.selectedList, item.id);
        }
      };
      ctrl.selectAll = function (isSelected) {
        ctrl.selectedList.data = [];
        angular.forEach(ctrl.data, function (e) {
          e.isSelected = isSelected;
          if (isSelected) {
            ctrl.selectedList.data.push(e.id);
          }
        });
      };
      ctrl.filter = function () {
        ctrl.data = [];
        ctrl.onFilterList();
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
        ctrl.minPriority = ctrl.data[0].priority;
      };
      ctrl.updateOrders = function (index, items) {
        if (index > ctrl.dragStartIndex) {
          ctrl.data.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.data.splice(ctrl.dragStartIndex + 1, 1);
        }
        ctrl.updateDataInfos();
      };
      ctrl.updateDataInfos = async function () {
        angular.forEach(ctrl.data, async function (e, i) {
          e.priority = ctrl.minPriority + i;
          var resp = await dataService.saveFields(e.id, {
            priority: e.priority,
          });
          if (resp && resp.isSucceed) {
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
          columns: ctrl.columns,
          item: item,
        };
        $rootScope.preview("mix-database-data", obj, null, "modal-lg");
      };
    },
  ],
});
