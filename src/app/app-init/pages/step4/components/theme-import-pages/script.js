﻿app.component("themeImportPages", {
  templateUrl:
    "/mix-app/views/app-init/pages/step4/components/theme-import-pages/view.html",
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
        // ctrl.getList();
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
        page.isImportData = selected && page.isImportData;
        let contentIds = page.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.importThemeDto.content.pageIds = ctrl.updateArray(
          ctrl.importThemeDto.content.pageIds,
          [page.id],
          selected
        );
        ctrl.importThemeDto.content.pageContentIds = ctrl.updateArray(
          ctrl.importThemeDto.content.pageContentIds,
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
        ctrl.importThemeDto.associations.pageIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.pageIds,
          [page.id],
          selected
        );
        ctrl.importThemeDto.associations.pageContentIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.pageContentIds,
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