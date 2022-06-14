app.component("pageModules", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/modules/modules.html",
  bindings: {
    page: "=",
    onDelete: "&?",
    onUpdate: "&?",
  },
  controller: [
    "$scope",
    "ngAppSettings",
    "ModuleRestService",
    function ($scope, ngAppSettings, moduleService) {
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
        ctrl.request.culture = ctrl.page.specificulture;
        ctrl.loadModules();
      };
      ctrl.loadModules = async () => {
        let getModules = await moduleService.getList(ctrl.request);
        if (getModules.success) {
          ctrl.modules = getModules.data.items;
          $scope.$apply();
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
