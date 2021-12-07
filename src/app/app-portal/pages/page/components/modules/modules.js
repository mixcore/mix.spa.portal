app.component("pageModules", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/modules/modules.html",
  bindings: {
    page: "=",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "ngAppSettings",
    "ModuleRestService",
    function (ngAppSettings, moduleService) {
      var ctrl = this;
      ctrl.modules = [];
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = () => {
        ctrl.request.selectedMembers = [
          "id",
          "title",
          "systemName",
          "createdDateTime",
          "type",
        ];
      };
      ctrl.loadModules = async () => {
        let getModules = await moduleService.getList(ctrl.request);
        if (getModules.success) {
          ctrl.modules = getModules.data.items;
        }
      };
    },
  ],
});
