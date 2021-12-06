app.component("themeImportMixDatabases", {
  templateUrl:
    "/mix-app/views/app-init/pages/step4/components/theme-import-mix-databases/view.html",
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
        mixDatabase.isImportData = selected && mixDatabase.isImportData;
        ctrl.updateContent([mixDatabase.id], selected);
      };
      ctrl.selectData = (mixDatabase, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.updateData([mixDatabase.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.importThemeDto.content.mixDatabaseIds = ctrl.unionArray(
            ctrl.importThemeDto.content.mixDatabaseIds,
            arr
          );
        } else {
          ctrl.importThemeDto.content.mixDatabaseIds =
            ctrl.importThemeDto.content.mixDatabaseIds.filter(
              (m) => arr.indexOf(m) < 0
            );
          ctrl.updateData(arr, false);
        }
      };
      ctrl.updateData = function (arr, selected) {
        if (selected) {
          ctrl.importThemeDto.data.mixDatabaseIds = ctrl.unionArray(
            ctrl.importThemeDto.data.mixDatabaseIds,
            arr
          );
        } else {
          ctrl.importThemeDto.data.mixDatabaseIds =
            ctrl.importThemeDto.data.mixDatabaseIds.filter(
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
          e.isImportData = ctrl.selectAllData;
        });
      };
      ctrl.unionArray = (a, b) => {
        return [...new Set([...a, ...b])];
      };
    },
  ],
  bindings: {
    importThemeDto: "=",
  },
});
