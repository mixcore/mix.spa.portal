modules.component("postFilterList", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/filter-list/filter-list.html",
  bindings: {
    request: "=",
    key: "=?",
    orders: "=?",
    createUrl: "=",
    createText: "=",
    categories: "=",
    postTypes: "=",
    callback: "&",
  },
  controller: [
    "$scope",
    "$rootScope",
    "ngAppSettings",
    "RestMixDatabaseDataPortalService",
    function ($scope, $rootScope, ngAppSettings, dataService) {
      var ctrl = this;
      ctrl.dateRange = {
        fromDate: null,
        toDate: null,
      };
      ctrl.request = angular.copy(ngAppSettings.request);

      ctrl.init = function () {
        if (!ctrl.orders) {
          ctrl.orders = ngAppSettings.orders;
        }
        ctrl.directions = ngAppSettings.directions;
        ctrl.pageSizes = ngAppSettings.pageSizes;
        ctrl.statuses = [];
        var statuses = ngAppSettings.contentStatuses;
        if (ctrl.request && ctrl.request.contentStatuses) {
          statuses = ctrl.request.contentStatuses;
        }
        angular.forEach(statuses, function (val, i) {
          ctrl.statuses.push({
            value: val,
            title: val,
          });
        });
      };

      ctrl.apply = function (pageIndex) {
        $rootScope.setRequest(ctrl.request, ctrl.key);
        ctrl.callback({ pageIndex: pageIndex });
      };
      ctrl.updateDate = function () {
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
});
