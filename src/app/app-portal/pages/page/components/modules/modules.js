app.component("pageModules", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/modules/modules.html",
  bindings: {
    leftId: "=",
    onDelete: "&?",
    onUpdate: "&?",
  },
  controller: [
    "$rootScope",
    "ngAppSettings",
    "ModuleRestService",
    function ($rootScope, ngAppSettings, moduleService) {
      var ctrl = this;
      ctrl.modules = [];
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.request.columns = [
          "id",
          "title",
          "systemName",
          "createdDateTime",
          "type",
        ];
        ctrl.loadModules();
      };
      ctrl.loadModules = async () => {
        let getModules = await moduleService.getList(ctrl.request);
        if (getModules.success) {
          ctrl.modules = getModules.data.items;
        }
      };
      ctrl.select = async (associations) => {
        ctrl.associations = associations;
        if (ctrl.onUpdate) {
          ctrl.onUpdate({ associations: associations });
        }
      };
    },
  ],
});
