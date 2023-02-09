app.component("themeExportMixDatabases", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-mix-databases/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service = $rootScope.getRestService("mix-database");
      ctrl.selectAllContent = false;
      ctrl.selectAllData = false;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.request.pageSize = null;
        ctrl.getList();
      };
      ctrl.getList = async (mixDatabaseIndex) => {
        if (mixDatabaseIndex !== undefined) {
          ctrl.request.mixDatabaseIndex = mixDatabaseIndex;
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
      ctrl.selectContent = (mixDatabase, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        mixDatabase.isExportData = selected && mixDatabase.isExportData;
        ctrl.exportThemeDto.content.mixDatabaseIds = ctrl.updateArray(
          ctrl.exportThemeDto.content.mixDatabaseIds,
          [mixDatabase.id],
          selected
        );
        if (!selected) {
          ctrl.selectData(mixDatabase, false);
        }
      };
      ctrl.selectData = (mixDatabase, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.exportThemeDto.associations.mixDatabaseIds = ctrl.updateArray(
          ctrl.exportThemeDto.associations.mixDatabaseIds,
          [mixDatabase.id],
          selected
        );
      };
      ctrl.updateArray = function (src, arr, selected) {
        if (selected) {
          src = ctrl.unionArray(src, arr);
        } else {
          src = src.filter((m) => arr.indexOf(m) < 0);
        }
        return src;
      };
      ctrl.selectAll = function (arr) {
        angular.forEach(arr, function (e) {
          ctrl.selectContent(e, ctrl.selectAllContent);
          ctrl.selectData(e, ctrl.selectAllData);
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
