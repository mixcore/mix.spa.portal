app.component("themeImportModules", {
  templateUrl:
    "/mix-app/views/app-init/pages/step4/components/theme-import-modules/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service = $rootScope.getRestService("mix-module");
      ctrl.selectAllContent = false;
      ctrl.selectAllData = false;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        // ctrl.getList();
      };
      ctrl.getList = async (moduleIndex) => {
        if (moduleIndex !== undefined) {
          ctrl.request.moduleIndex = moduleIndex;
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
      ctrl.selectContent = (module, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        module.isImportData = selected && module.isImportData;
        let contentIds = module.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.importThemeDto.content.moduleIds = ctrl.updateArray(
          ctrl.importThemeDto.content.moduleIds,
          [module.id],
          selected
        );
        ctrl.importThemeDto.content.moduleContentIds = ctrl.updateArray(
          ctrl.importThemeDto.content.moduleContentIds,
          contentIds,
          selected
        );
        if (!selected) {
          ctrl.selectData(module, false);
        }
      };
      ctrl.selectData = (module, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        let contentIds = module.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.importThemeDto.associations.moduleIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.moduleIds,
          [module.id],
          selected
        );
        ctrl.importThemeDto.associations.moduleContentIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.moduleContentIds,
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
