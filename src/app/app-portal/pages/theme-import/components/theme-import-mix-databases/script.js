app.component("themeImportMixDatabases", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme-import/components/theme-import-mix-databases/view.html",
  bindings: {
    importThemeDto: "=",
  },
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
        ctrl.data = ctrl.importThemeDto.mixDatabases;
      };

      ctrl.selectContent = (mixDatabase, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        mixDatabase.isImportData = selected && mixDatabase.isImportData;
        ctrl.importThemeDto.content.mixDatabaseIds = ctrl.updateArray(
          ctrl.importThemeDto.content.mixDatabaseIds,
          [mixDatabase.id],
          selected
        );
        if (!selected) {
          ctrl.selectData(mixDatabase, false);
        }
      };
      ctrl.selectData = (mixDatabase, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.importThemeDto.associations.mixDatabaseIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.mixDatabaseIds,
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
          e.isImportData = ctrl.selectAllData;
        });
      };
      ctrl.validate = (mixDatabase) => {
        if (
          ctrl.importThemeDto.invalidDatabaseNames.indexOf(
            mixDatabase.systemName
          ) >= 0
        ) {
          return `${mixDatabase.systemName} is invalid`;
        }
      };
      ctrl.unionArray = (a, b) => {
        return [...new Set([...a, ...b])];
      };
    },
  ],
});
