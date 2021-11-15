modules.component("filterList", {
  templateUrl:
    "/mix-app/views/app-portal/components/filter-list/filter-list.html",
  controller: [
    "$scope",
    "$rootScope",
    "ngAppSettings",
    function ($scope, $rootScope, ngAppSettings) {
      var ctrl = this;
      ctrl.dateRange = {
        fromDate: null,
        toDate: null,
      };
      ctrl.init = function () {
        if (!ctrl.arrOrderby) {
          ctrl.arrOrderby = ["Title", "Priority", "CreatedDateTime", "Status"];
        }
        ctrl.request.orderBy = ctrl.request.orderBy || ctrl.arrOrderby[0];
        ctrl.directions = ["Asc", "Desc"];
        ctrl.pageSizes = [5, 10, 15, 20];
        ctrl.statuses = $rootScope.appSettings.statuses;
      };
      ctrl.apply = function (pageIndex) {
        $rootScope.setRequest(ctrl.request, ctrl.key);
        ctrl.callback({ pageIndex: pageIndex });
      };
      ctrl.updateDate = function () {
        ctrl.request.pageIndex = 0;
        if (Date.parse(ctrl.dateRange.fromDate)) {
          ctrl.request.fromDate = new Date(
            ctrl.dateRange.fromDate
          ).toISOString();
        } else {
          $scope.request.fromDate = null;
        }
        if (Date.parse(ctrl.dateRange.toDate)) {
          ctrl.request.toDate = new Date(ctrl.dateRange.toDate).toISOString();
        } else {
          ctrl.request.toDate = null;
        }
        $rootScope.setRequest(ctrl.request, ctrl.key);
        ctrl.callback({ pageIndex: 0 });
      };
    },
  ],
  bindings: {
    request: "=",
    key: "=?",
    arrOrderby: "=?",
    createUrl: "=",
    createText: "=",
    callback: "&",
  },
});
