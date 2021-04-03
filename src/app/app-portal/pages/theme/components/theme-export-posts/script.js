app.component("themeExportPosts", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-posts/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.updatePostExport = function (value, isSelected) {
        // Filter actived post
        var idx = (ctrl.selectedExport.posts = angular.copy(
          $rootScope.filterArray(ctrl.exportData.posts, ["isActived"], [true])
        ));
      };
      ctrl.isSelected = function (value) {
        return ctrl.selectedValues.indexOf(value) >= 0;
      };
      ctrl.selectAll = function (arr) {
        ctrl.selectedList.data = [];
        angular.forEach(arr, function (e) {
          e.isActived = ctrl.selectedList.isSelectAll;
          e.isExportData = ctrl.selectedList.isExportData;
        });
        ctrl.updatePostExport();
      };
    },
  ],
  bindings: {
    exportData: "=",
    selectedExport: "=",
  },
});
