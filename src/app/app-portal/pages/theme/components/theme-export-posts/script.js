﻿app.component("themeExportPosts", {
  templateUrl:
    "/mix-app/views/app-portal/pages/theme/components/theme-export-posts/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "BaseRestService",
    function ($rootScope, $scope, ngAppSettings, baseRestService) {
      var ctrl = this;
      var service = angular.copy(baseRestService);
      service.initService("/rest/mix-library", "mix-post");
      ctrl.selectAllContent = false;
      ctrl.selectAllData = false;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.request.pageSize = 10000;
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
        post.isExportData = selected && post.isExportData;
        let contentIds = post.contents.map(function (obj) {
          return obj.id;
        });
        ctrl.exportThemeDto.content.postIds = ctrl.updateArray(
          ctrl.exportThemeDto.content.postIds,
          [post.id],
          selected
        );
        ctrl.exportThemeDto.content.postContentIds = ctrl.updateArray(
          ctrl.exportThemeDto.content.postContentIds,
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
        ctrl.exportThemeDto.associations.postIds = ctrl.updateArray(
          ctrl.exportThemeDto.associations.postIds,
          [post.id],
          selected
        );
        ctrl.exportThemeDto.associations.postContentIds = ctrl.updateArray(
          ctrl.exportThemeDto.associations.postContentIds,
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
