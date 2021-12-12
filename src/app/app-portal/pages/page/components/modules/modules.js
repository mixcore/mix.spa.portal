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
      var service = $rootScope.getRestService("mix-page-module");
      ctrl.modules = [];
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.associationRequest = angular.copy(ngAppSettings.request);
      ctrl.$onInit = async () => {
        ctrl.request.columns = [
          "id",
          "title",
          "systemName",
          "createdDateTime",
          "type",
        ];
        ctrl.associationRequest.leftId = ctrl.leftId;
        var getAssociations = await service.getList(ctrl.associationRequest);
        ctrl.associations = getAssociations.data.items;
        ctrl.loadModules();
      };
      ctrl.loadModules = async () => {
        let getModules = await moduleService.getList(ctrl.request);
        if (getModules.success) {
          ctrl.modules = getModules.data.items;
          angular.forEach(ctrl.modules, function (e) {
            e.isActived =
              ctrl.associations.filter((m) => m.rightId == e.id).length > 0;
          });
        }
      };
      ctrl.select = async (module) => {
        if (module.isActived) {
          var nav = {
            leftId: ctrl.leftId,
            rightId: module.id,
          };
          ctrl.associations.push(nav);
          if (ctrl.onUpdate) {
            ctrl.onUpdate({ module: nav });
          }
        } else {
          var nav = ctrl.associations.filter((m) => m.rightId == module.id)[0];
          if (nav && nav.id) {
            await service.delete([nav.id]);
          }
        }
      };
    },
  ],
});
