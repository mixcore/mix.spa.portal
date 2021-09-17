modules.component("relatedNavs", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/related-navigations/view.html",
  bindings: {
    request: "=",
    prefix: "=",
    sourceId: "=",
    culture: "=",
    navs: "=",
    data: "=",
    categories: "=",
    postTypes: "=",
    loadData: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.selected = null;
      ctrl.activeItem = function (item, index) {
        var currentItem = $rootScope.findObjectByKey(
          ctrl.navs,
          ["sourceId", "destinationId"],
          [ctrl.sourceId, item.id]
        );
        if (currentItem === null) {
          currentItem = item;
          currentItem.priority = ctrl.navs.length + 1;
          ctrl.navs.push(currentItem);
          ctrl.data.items.splice(index, 1);
        }
      };
      ctrl.updateOrders = function (index) {
        ctrl.navs.splice(index, 1);
        for (var i = 0; i < ctrl.data.length; i++) {
          ctrl.navs[i].priority = i + 1;
        }
      };
      ctrl.load = async function (pageIndex) {
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        ctrl.data = await ctrl.loadData({ pageIndex: ctrl.request.pageIndex });
        $scope.$apply();
      };
      ctrl.checkActived = function (item) {
        if (ctrl.navs) {
          return ctrl.navs.find(function (nav) {
            return nav.destinationId === item.id;
          });
        }
      };
    },
  ],
});
