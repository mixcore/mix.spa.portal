app.component("themeExportMixDatabases", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-mix-databases/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.updateMixDatabaseExport = function () {
        ctrl.selectedExport.mixDatabases = angular.copy(
          $rootScope.filterArray(
            ctrl.exportData.mixDatabases,
            ["isActived"],
            [true]
          )
        );
        // angular.forEach(ctrl.selectedExport.mixDatabases,function(e){
        //     e.data = angular.copy($rootScope.filterArray(e.data, ['isActived'], [true]));
        // });
      };
      ctrl.selectAll = function (arr) {
        ctrl.selectedList.data = [];
        angular.forEach(arr, function (e) {
          e.isActived = ctrl.selectedList.isSelectAll;
          e.isExportData = ctrl.selectedList.isExportData;
        });
        ctrl.updateMixDatabaseExport();
      };
    },
  ],
  bindings: {
    exportData: "=",
    selectedExport: "=",
  },
});
