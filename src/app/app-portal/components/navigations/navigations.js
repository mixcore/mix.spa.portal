modules.component("navigators", {
  templateUrl:
    "/mix-app/views/app-portal/components/navigations/navigations.html",
  bindings: {
    modelName: "=",
    parentId: "=",
    associations: "=",
    titleField: "=?",

    prefix: "=",
    detailUrl: "=",
    data: "=",
    titleMaxLength: "=?",
    callback: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "$location",
    function ($rootScope, $scope, ngAppSettings, $location) {
      var ctrl = this;
      var service;
      ctrl.selected = null;
      ctrl.activedIndex = null;
      ctrl.$onInit = async () => {
        ctrl.titleField = ctrl.titleField || "title";
        service = $rootScope.getRestService(ctrl.modelName);
        ctrl.associationRequest = angular.copy(ngAppSettings.request);
        ctrl.associationRequest.orderBy = "Priority";
        ctrl.associationRequest.direction = "Asc";
        ctrl.associationRequest.parentId = ctrl.parentId;
        var getAssociations = await service.getList(ctrl.associationRequest);
        ctrl.associations = getAssociations.data.items;
        ctrl.loadData();
      };
      ctrl.loadData = async () => {
        var maxPriority = 0;
        if (ctrl.associations.length > 0) {
          maxPriority =
            ctrl.associations[ctrl.associations.length - 1].priority || 0;
        }
        angular.forEach(ctrl.data, function (e, i) {
          let nav = ctrl.associations.filter((m) => m.childId == e.id)[0];
          if (nav) {
            if (nav.priority == undefined) {
              nav.priority = maxPriority + 1;
              maxPriority++;
            }
            e.isActived = true;
            e.priority = nav.priority || 0;
          } else {
            e.isActived = false;
            e.priority = maxPriority + 1;
            maxPriority++;
          }
          e.isActived = nav != null;
        });
        ctrl.data = $rootScope.sortArray(ctrl.data, "priority");
      };
      ctrl.select = async (obj) => {
        if (obj.isActived) {
          ctrl.selectItem(obj);
        } else {
          ctrl.removeItem(obj);
        }
        if (ctrl.callback) {
          ctrl.callback({ associations: ctrl.associations });
        }
      };
      ctrl.removeItem = async (obj) => {
        var nav = ctrl.associations.filter((m) => m.childId == obj.id)[0];
        $rootScope.removeObjectByKey(ctrl.associations, "childId", obj.id);
        if (nav && nav.id) {
          await service.delete([nav.id]);
          $rootScope.showMessage("saved", "success");
        }
      };
      ctrl.selectItem = async (obj) => {
        var nav = {
          parentId: ctrl.parentId,
          childId: obj.id,
          priority: obj.priority,
        };
        if (ctrl.parentId) {
          var result = await service.save(nav);
          nav.id = result.data;
          $rootScope.showMessage("saved", "success");
        }
        ctrl.associations.push(nav);
        if (ctrl.callback) {
          ctrl.callback({ selected: nav });
        }
      };
      ctrl.getTitle = (item) => {
        return item[ctrl.titleField];
      };
      ctrl.updateOrders = async function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.data.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.data.splice(ctrl.dragStartIndex + 1, 1);
        }
        angular.forEach(ctrl.data, function (e, i) {
          e.priority = ctrl.minPriority + i;
        });
        ctrl.saveOrder();
      };
      ctrl.saveOrder = async () => {
        angular.forEach(ctrl.data, function (e, i) {
          let nav = ctrl.associations.filter((m) => m.childId == e.id)[0];
          if (nav) {
            nav.priority = ctrl.data[i].priority;
          }
        });
        if (ctrl.parentId) {
          var result = await service.saveMany(ctrl.associations);
          if (result.success) {
            $rootScope.showMessage("saved", "success");
          }
        }
      };
      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.data[0].priority;
      };
      ctrl.goToDetails = async function (nav) {
        $location.url(ctrl.detailUrl + nav[ctrl.key]);
      };
    },
  ],
});
