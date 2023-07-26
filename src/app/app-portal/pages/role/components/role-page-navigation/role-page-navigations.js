﻿modules.component("rolePageNav", {
  templateUrl:
    "/mix-app/views/app-portal/pages/role/components/role-page-navigation/role-page-navigations.html",
  bindings: {
    prefix: "=",
    page: "=",
    callback: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RoleService",
    function ($rootScope, $scope, ngAppSettings, roleServices) {
      var ctrl = this;
      ctrl.selected = null;
      ctrl.updateOrders = function (index) {
        ctrl.data.splice(index, 1);
        for (var i = 0; i < ctrl.data.length; i++) {
          ctrl.data[i].priority = i + 1;
        }
      };
      //ctrl.change = async function () {
      //    //var permission = ctrl.page.navPermission;
      //    //$rootScope.isBusy = true;
      //    //var resp = await roleServices.updatePermission(permission);
      //    //if (resp && resp.success) {
      //    //    $rootScope.showMessage('Update successfully!', 'success');
      //    //    $rootScope.isBusy = false;
      //    //    $scope.$apply();
      //    //}
      //    //else {
      //    //    if (resp) { $rootScope.showErrors(resp.errors); }
      //    //    $rootScope.isBusy = false;
      //    //    $scope.$apply();
      //    //}
      //};
    },
  ],
});
