app.component("themeExportPosts", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-posts/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "PostRestService",
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
      ctrl.selectContent = (post, selected) => {
        ctrl.selectAllContent = ctrl.selectAllContent && selected;
        ctrl.selectAllData = ctrl.selectAllData && selected;
        post.isExportData = selected && post.isExportData;
        ctrl.updateContent([post.id], selected);
      };
      ctrl.selectData = (post, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        ctrl.updateData([post.id], selected);
      };
      ctrl.updateContent = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.content.postIds = ctrl.unionArray(
            ctrl.selectedExport.content.postIds,
            arr
          );
        } else {
          ctrl.selectedExport.content.postIds =
            ctrl.selectedExport.content.postIds.filter(
              (m) => arr.indexOf(m) < 0
            );
          ctrl.updateData(arr, false);
        }
      };
      ctrl.updateData = function (arr, selected) {
        if (selected) {
          ctrl.selectedExport.data.postIds = ctrl.unionArray(
            ctrl.selectedExport.data.postIds,
            arr
          );
        } else {
          ctrl.selectedExport.data.postIds =
            ctrl.selectedExport.data.postIds.filter((m) => arr.indexOf(m) < 0);
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
