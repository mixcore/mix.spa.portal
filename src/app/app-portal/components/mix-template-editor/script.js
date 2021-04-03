modules.component("mixTemplateEditor", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-template-editor/view.html",
  bindings: {
    template: "=",
    folderType: "=",
    isReadonly: "=?",
    lineCount: "=?",
    hideJs: "=?",
    hideCss: "=?",
  },
  controller: [
    "$scope",
    "$rootScope",
    "$routeParams",
    "ngAppSettings",
    "GlobalSettingsService",
    "TemplateService",
    function (
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      globalSettingsService,
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
      ctrl.isNull = false;
      ctrl.request = angular.copy(ngAppSettings.request);
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
        if (ctrl.folderType) {
          var themeId = $rootScope.localizeSettings.data.ThemeId;
          ctrl.request.key = ctrl.folderType;
          var resp = await service.getList(ctrl.request, [themeId]);

          if (resp && resp.isSucceed) {
            ctrl.templates = resp.data.items;
            if (!ctrl.template) {
              ctrl.template = ctrl.templates[0];
            }
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
      ctrl.updateTemplateContent = function (content) {
        ctrl.template.content = content;
      };
      ctrl.updateStyleContent = function (content) {
        ctrl.template.scripts = content;
      };
      ctrl.updateScriptContent = function (content) {
        ctrl.template.styles = content;
      };
    },
  ],
});
