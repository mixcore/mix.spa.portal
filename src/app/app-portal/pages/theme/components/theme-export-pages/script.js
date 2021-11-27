app.component("themeExportPages", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-pages/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service = $rootScope.getRestService("mix-page");
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
        let contentIds = page.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.exportThemeDto.content.pageIds = ctrl.updateArray(
          ctrl.exportThemeDto.content.pageIds,
          [page.id],
          selected
        );
        ctrl.exportThemeDto.content.pageContentIds = ctrl.updateArray(
          ctrl.exportThemeDto.content.pageContentIds,
          contentIds,
          selected
        );
        if (!selected) {
          ctrl.selectData(page, false);
        }
      };
      ctrl.selectData = (page, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        let contentIds = page.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.exportThemeDto.data.pageIds = ctrl.updateArray(
          ctrl.exportThemeDto.data.pageIds,
          [page.id],
          selected
        );
        ctrl.exportThemeDto.data.pageContentIds = ctrl.updateArray(
          ctrl.exportThemeDto.data.pageContentIds,
          contentIds,
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
