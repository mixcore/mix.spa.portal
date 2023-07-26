modules.component("filterList", {
  templateUrl:
    "/mix-app/views/app-portal/components/filter-list/filter-list.html",
  controller: [
    "$scope",
    "$rootScope",
    "ngAppSettings",
    "CultureService",
    function ($scope, $rootScope, ngAppSettings, cultureService) {
      var ctrl = this;
      ctrl.dateRange = {
        fromDate: null,
        toDate: null,
      };
      ctrl.searchMethods = ["Equal", "Like"];
      ctrl.init = async function () {
        if (!ctrl.arrOrderby) {
          ctrl.arrOrderby = [
            "Title",
            "Priority",
            "CreatedDateTime",
            "LastModified",
            "Status",
          ];
        }
        ctrl.request.orderBy = ctrl.request.orderBy || ctrl.arrOrderby[0];
        ctrl.directions = ["Asc", "Desc"];
        ctrl.pageSizes = [5, 10, 15, 20];
        ctrl.statuses = $rootScope.globalSettings.statuses;
      };
      ctrl.changeLang = function (culture) {
        if (culture) {
          ctrl.selectedCulture = culture;
          ctrl.request.culture = culture.specificulture;
        } else {
          ctrl.selectedCulture = null;
          ctrl.request.culture = null;
        }
        ctrl.apply(0);
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
