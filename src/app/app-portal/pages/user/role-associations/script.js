modules.component("roleAssociations", {
  templateUrl:
    "/mix-app/views/app-portal/pages/user/role-associations/view.html",
  bindings: {
    userRoles: "=",
    callback: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "$location",
    "RoleService",
    function ($rootScope, $scope, ngAppSettings, $location, roleService) {
      var ctrl = this;
      ctrl.selected = null;
      ctrl.activedIndex = null;
      ctrl.$onInit = async () => {
        var getRoles = await roleService.getList();
        if (getRoles.success) {
          ctrl.roles = getRoles.data.items;
        }
        if (!ctrl.userRoles) {
          ctrl.userRoles = [];
        }
        angular.forEach(ctrl.roles, (e) => {
          e.isActived = ctrl.userRoles.find((u) => u.roleId == e.id) != null;
        });
      };

      ctrl.select = async (obj) => {
        if (ctrl.callback) {
          ctrl.callback({ role: obj });
        }
      };

      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
        ctrl.minPriority = ctrl.data[0].priority;
      };
      ctrl.goToDetails = async function (nav) {
        $location.url(ctrl.detailUrl + nav[ctrl.key]);
      };
    },
  ],
});
