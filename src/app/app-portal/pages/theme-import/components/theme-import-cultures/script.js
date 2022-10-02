app.component("themeImportCultures", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme-import/components/theme-import-cultures/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service = $rootScope.getRestService("mix-culture");
      ctrl.selectAllContent = false;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.getList();
      };
      ctrl.getList = async (cultureIndex) => {
        if (cultureIndex !== undefined) {
          ctrl.request.cultureIndex = cultureIndex;
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
      ctrl.selectContent = (culture, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        culture.isImportData = selected && culture.isImportData;
        ctrl.updateContent([culture.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.importThemeDto.cultureIds = ctrl.unionArray(
            ctrl.importThemeDto.cultureIds,
            arr
          );
        } else {
          ctrl.importThemeDto.cultureIds =
            ctrl.importThemeDto.cultureIds.filter((m) => arr.indexOf(m) < 0);
          ctrl.updateData(arr, false);
        }
      };
      ctrl.selectAll = function (arr) {
        // ctrl.selectedList.data = [];
        var ids = arr.map(function (obj) {
          return obj.id;
        });
        ctrl.updateContent(ids, ctrl.selectAllContent);
        angular.forEach(arr, function (e) {
          e.isActived = ctrl.selectAllContent;
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
