app.component("themeExportModules", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-modules/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "ModuleRestService",
    function ($rootScope, $scope, ngAppSettings, service) {
      var ctrl = this;
      ctrl.selectAllContent = false;
      ctrl.selectAllData = false;
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
      ctrl.selectContent = (module, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        module.isExportData = selected && module.isExportData;
        ctrl.updateContent([module.id], selected);
      };
      ctrl.selectData = (module, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.updateData([module.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.exportThemeDto.content.moduleIds = ctrl.unionArray(
            ctrl.exportThemeDto.content.moduleIds,
            arr
          );
        } else {
          ctrl.exportThemeDto.content.moduleIds =
            ctrl.exportThemeDto.content.moduleIds.filter(
              (m) => arr.indexOf(m) < 0
            );
          ctrl.updateData(arr, false);
        }
      };
      ctrl.updateData = function (arr, selected) {
        if (selected) {
          ctrl.exportThemeDto.data.moduleIds = ctrl.unionArray(
            ctrl.exportThemeDto.data.moduleIds,
            arr
          );
        } else {
          ctrl.exportThemeDto.data.moduleIds =
            ctrl.exportThemeDto.data.moduleIds.filter(
              (m) => arr.indexOf(m) < 0
            );
        }
      };
      ctrl.selectAll = function (arr) {
        // ctrl.selectedList.data = [];
        var ids = arr.map(function (obj) {
          return obj.id;
        });
        ctrl.updateContent(ids, ctrl.selectAllContent);
        ctrl.updateData(ids, ctrl.selectAllData);
        angular.forEach(arr, function (e) {
          e.isActived = ctrl.selectAllContent;
          e.isExportData = ctrl.selectAllData;
        });
      };
      ctrl.unionArray = (a, b) => {
        return [...new Set([...a, ...b])];
      };
    },
  ],
  bindings: {
    exportThemeDto: "=",
  },
});
