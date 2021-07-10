modules.component("templateEditor", {
  templateUrl:
    "/mix-app/views/app-portal/components/template-editor/templateEditor.html",
  bindings: {
    template: "=",
    templates: "=",
    folderType: "=",
    isReadonly: "=?",
    lineCount: "=?",
    hideJs: "=?",
    hideCss: "=?",
    enableRename: "=?",
  },
  controller: [
    "$scope",
    "$rootScope",
    "$routeParams",
    "ngAppSettings",
    "AppSettingsService",
    "TemplateService",
    function (
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      appSettingsService,
      service
    ) {
      BaseCtrl.call(
        this,
        $scope,
        $rootScope,
        $routeParams,
        ngAppSettings,
        service
      );
      var ctrl = this;
      BaseHub.call(this, ctrl);
      ctrl.isNull = false;
      ctrl.selectPane = function (pane) {
        ctrl.activedPane = pane;
      };
      ctrl.selectTemplate = function (template) {
        ctrl.template = template;
        $scope.$broadcast("updateContentCodeEditors", []);
      };
      ctrl.new = function () {
        ctrl.template.id = 0;
      };
      ctrl.init = async function () {
        if (!ctrl.template && ctrl.templates) {
          ctrl.template = ctrl.templates[0];
        }
        if (ctrl.folderType && !ctrl.folderType) {
          var themeId = appSettingsService.get("themeId");
          var resp = await service.getSingle([
            "portal",
            themeId,
            ctrl.folderType,
          ]);
          if (resp && resp.success) {
            resp.data.fileName = "new";
            ctrl.templates.splice(0, 0, resp.data);
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
              $rootScope.isBusy = false;
              $scope.$apply();
            }
          }
        }
      };
    },
  ],
});
