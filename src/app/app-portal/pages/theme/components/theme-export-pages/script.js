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
      ctrl.selectContent = (page, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        page.isExportData = selected && page.isExportData;
        ctrl.updateContent([page.id], selected);
      };
      ctrl.selectData = (page, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.updateData([page.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.content.pageIds = ctrl.unionArray(
            ctrl.selectedExport.content.pageIds,
            arr
          );
        } else {
          ctrl.selectedExport.content.pageIds =
            ctrl.selectedExport.content.pageIds.filter(
              (m) => arr.indexOf(m) < 0
            );
          ctrl.updateData(arr, false);
        }
      };
      ctrl.updateData = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.data.pageIds = ctrl.unionArray(
            ctrl.selectedExport.data.pageIds,
            arr
          );
        } else {
          ctrl.selectedExport.data.pageIds =
            ctrl.selectedExport.data.pageIds.filter((m) => arr.indexOf(m) < 0);
        }
      };
      ctrl.isSelected = function (value) {
        return ctrl.selectedValues.indexOf(value) >= 0;
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
