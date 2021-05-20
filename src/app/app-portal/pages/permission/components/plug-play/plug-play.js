app.component("permissionPlugPlay", {
  templateUrl:
    "/mix-app/views/app-portal/pages/permission/components/plug-play/plug-play.html",
  bindings: {
    page: "=",
    prefixParent: "=",
    prefixChild: "=",
    searchText: "=",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$element",
    "PermissionService",
    function ($rootScope, $scope, $location, $element, service) {
      var ctrl = this;
      ctrl.type = "Children";
      ctrl.goToPath = $rootScope.goToPath;
      ctrl.request = {
        pageSize: "5",
        pageIndex: 0,
        status: "Published",
        orderBy: "CreatedDateTime",
        direction: "Desc",
        fromDate: null,
        toDate: null,
      };
      ctrl.pages = [];
      ctrl.init = function () {
        if (ctrl.page) {
          ctrl.request.exceptIds = ctrl.page.parentNavs
            .map((p) => p.pageId)
            .concat(ctrl.page.childNavs.map((p) => p.pageId));
          if (ctrl.request.exceptIds.indexOf(ctrl.page.id) === -1) {
            ctrl.request.exceptIds.push(ctrl.page.id);
          }
          ctrl.getList();
        }
      };
      ctrl.selectPane = function (pane) {
        if (ctrl.page) {
          ctrl.type = pane.header;
          ctrl.request.keyword = "";
          ctrl.init();
        }
      };

      ctrl.selectItem = (nav) => {
        if (ctrl.type == "Parents") {
          if (
            !$rootScope.findObjectByKey(ctrl.page.parentNavs, "pageId", nav.id)
          ) {
            ctrl.page.parentNavs.push({
              isActived: true,
              pageId: ctrl.page.id,
              parentId: nav.id,
              description: nav.textDefault,
              status: "Published",
              parent: nav,
            });
          }
        } else {
          if (
            !$rootScope.findObjectByKey(ctrl.page.childNavs, "pageId", nav.id)
          ) {
            ctrl.page.childNavs.push({
              isActived: true,
              pageId: nav.id,
              parentId: ctrl.page.id,
              description: nav.textDefault,
              status: "Published",
              page: nav,
            });
          }
        }
      };

      ctrl.getList = async function () {
        $rootScope.isBusy = true;
        var resp = await service.getList(ctrl.request);
        if (resp && resp.isSucceed) {
          ctrl.pages = resp.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors || ["Failed"]);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
});
