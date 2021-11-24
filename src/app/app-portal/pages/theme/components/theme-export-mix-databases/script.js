app.component("themeExportMixDatabases", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-mix-databases/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestMixDatabasePortalService",
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
      ctrl.selectContent = (mixDatabase, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        mixDatabase.isExportData = selected && mixDatabase.isExportData;
        ctrl.updateContent([mixDatabase.id], selected);
      };
      ctrl.selectData = (mixDatabase, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.updateData([mixDatabase.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.content.mixDatabaseIds = ctrl.unionArray(
            ctrl.selectedExport.content.mixDatabaseIds,
            arr
          );
        } else {
          ctrl.selectedExport.content.mixDatabaseIds =
            ctrl.selectedExport.content.mixDatabaseIds.filter(
              (m) => arr.indexOf(m) < 0
            );
          ctrl.updateData(arr, false);
        }
      };
      ctrl.updateData = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.data.mixDatabaseIds = ctrl.unionArray(
            ctrl.selectedExport.data.mixDatabaseIds,
            arr
          );
        } else {
          ctrl.selectedExport.data.mixDatabaseIds =
            ctrl.selectedExport.data.mixDatabaseIds.filter(
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
    selectedExport: "=",
  },
});
