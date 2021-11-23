app.component("themeExportPages", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-pages/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "PageRestService",
    function ($rootScope, $scope, ngAppSettings, service) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.getList();
      };
      ctrl.getList = async (pageIndex) => {
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var d = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = d.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var d = new Date(ctrl.request.toDate);
          ctrl.request.toDate = d.toISOString();
        }
        let getData = await service.getList(ctrl.request);
        if (getData.success) {
          ctrl.data = getData.data;
        }
      };
      ctrl.updatePageExport = function (value, isSelected) {
        // Filter actived page
        ctrl.selectedExport.content.pageIds = [1, 2];
        // var idx = (ctrl.selectedExport.pages = angular.copy(
        //   $rootScope.filterArray(ctrl.data.items, ["isActived"], [true])
        // ));

        // // Loop actived page
        // angular.forEach(ctrl.selectedExport.pages, function (e) {
        //     // filter list actived modules
        //     e.moduleNavs = angular.copy($rootScope.filterArray(e.moduleNavs, ['isActived'], [true]));

        //     // Loop actived modules
        //     angular.forEach(e.moduleNavs, function (n) {
        //         // filter list actived data
        //         n.module.data.items = angular.copy($rootScope.filterArray(n.module.data.items, ['isActived'], [true]));
        //         $rootScope.removeObjectByKey(ctrl.exportData.modules, 'id', n.moduleId);
        //         $rootScope.removeObjectByKey(ctrl.selectedExport.modules, 'id', n.moduleId);
        //     });
        // });
      };
      ctrl.isSelected = function (value) {
        return ctrl.selectedValues.indexOf(value) >= 0;
      };
      ctrl.selectAll = function (arr) {
        // ctrl.selectedList.data = [];
        var ids = arr
          .filter((m) => ctrl.selectedExport.content.pageIds.indexOf(m.id) < 0)
          .map(function (obj) {
            return obj.id;
          });
        if (ctrl.selectedExport.isSelectAll) {
          console.log(ids);
          ctrl.selectedExport.content.pageIds =
            ctrl.selectedExport.content.pageIds.concat(ids);
        }
        angular.forEach(arr, function (e) {
          e.isActived = ctrl.selectedList.isSelectAll;
          e.isExportData = ctrl.selectedList.isExportData;
        });
        ctrl.updatePageExport();
      };
    },
  ],
  bindings: {
    exportData: "=",
    selectedExport: "=",
  },
});
