﻿sharedComponents.component("mixModuleDataTable", {
  templateUrl:
    "/mix-app/views/app-shared/components/mix-module-data-table/mix-module-data-table.html",
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "ngAppSettings",
    "SharedModuleDataService",
    function ($rootScope, $scope, $location, ngAppSettings, dataService) {
      var ctrl = this;
      ctrl.colWidth = 3;
      ctrl.init = function () {
        ctrl.editUrl = "/admin/module-data/details/" + ctrl.moduleContentId;
        ctrl.visible = $rootScope.visible;
        if (ctrl.data.items.length) {
          ctrl.min = ctrl.data.items[0].priority;
          if (!ctrl.min) {
            ctrl.min = 0;
          }
        }
        ctrl.colWidth = parseInt(9 / ctrl.columns.length);
        ctrl.lastColWidth = 9 % ctrl.columns.length > 0 ? 2 : 1;
      };
      ctrl.translate = $rootScope.translate;
      ctrl.selected = null;
      ctrl.updateOrders = function (index, items) {
        items.splice(index, 1);
        for (var i = 0; i < items.length; i++) {
          items[i].priority = ctrl.min + i;
        }
        ctrl.updateDataInfos(items);
      };
      ctrl.updateDataInfos = async function (items) {
        $rootScope.isBusy = true;
        var resp = await dataService.updateInfos(items);
        if (resp && resp.success) {
          $scope.activedPage = resp.data;
          $rootScope.showMessage("success", "success");
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.dragoverCallback = function (index, item, external, type) {
        //console.log('drop ', index, item, external, type);
      };
      ctrl.insertCallback = function (index, item, external, type) {
        //console.log('insert ', index, item, external, type);
      };
      ctrl.delete = function (id) {
        ctrl.onDelete({ id: id });
      };
      ctrl.goTo = function (id) {
        $location.path(ctrl.editUrl + "/" + id);
      };
      ctrl.toggleChildNavs = function (nav) {
        nav.showChildNavs = nav.childNavs.length > 0 && !nav.showChildNavs;
      };
      ctrl.view = function (moduleContentId, contentId) {
        var obj = {
          moduleContentId: moduleContentId,
          id: contentId,
        };
        $rootScope.preview("module-data", obj, null, "modal-lg");
      };
    },
  ],
  bindings: {
    moduleContentId: "=",
    data: "=",
    childName: "=",
    canDrag: "=",
    editUrl: "=",
    columns: "=",
    onDelete: "&",
    // onUpdateInfos: '&',
    onUpdateChildInfos: "&",
  },
});
