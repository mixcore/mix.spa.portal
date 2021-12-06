app.component("themeImportPosts", {
  templateUrl:
    "/mix-app/views/app-init/pages/step4/components/theme-import-posts/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service = $rootScope.getRestService("mix-post");
      ctrl.selectAllContent = false;
      ctrl.selectAllData = false;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.getList();
      };
      ctrl.getList = async (postIndex) => {
        if (postIndex !== undefined) {
          ctrl.request.postIndex = postIndex;
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
        post.isImportData = selected && post.isImportData;
        let contentIds = post.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.importThemeDto.content.postIds = ctrl.updateArray(
          ctrl.importThemeDto.content.postIds,
          [post.id],
          selected
        );
        ctrl.importThemeDto.content.postContentIds = ctrl.updateArray(
          ctrl.importThemeDto.content.postContentIds,
          contentIds,
          selected
        );
        if (!selected) {
          ctrl.selectData(post, false);
        }
      };
      ctrl.selectData = (post, selected) => {
        ctrl.selectAllData = ctrl.selectAllData && selected;
        let contentIds = post.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.importThemeDto.associations.postIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.postIds,
          [post.id],
          selected
        );
        ctrl.importThemeDto.associations.postContentIds = ctrl.updateArray(
          ctrl.importThemeDto.associations.postContentIds,
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
