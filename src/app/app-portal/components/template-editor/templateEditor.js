modules.component("templateEditor", {
  templateUrl:
    "/mix-app/views/app-portal/components/template-editor/templateEditor.html",
  bindings: {
    templateId: "=",
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
    "ThemeService",
    "TemplateService",
    function (
      $scope,
      $rootScope,
      $routeParams,
      ngAppSettings,
      appSettingsService,
      themeService,
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
      ctrl.themeRequest = angular.copy(ngAppSettings.request);
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.isNull = false;
      ctrl.selectPane = function (pane) {
        ctrl.activedPane = pane;
      };
      ctrl.selectTheme = () => {
        ctrl.loadTemplates();
        ctrl.createUrl = `/admin/template/create/${ctrl.theme.id}/${ctrl.folderType}`;
      };
      ctrl.selectTemplate = function () {
        ctrl.template = null;
        setTimeout(() => {
          ctrl.template = ctrl.selectedTemplate;
          ctrl.templateId = ctrl.selectedTemplate.id;
          $scope.$apply();
        }, 50);
      };
      ctrl.new = function () {
        ctrl.template.id = 0;
      };
      ctrl.init = async function () {
        await ctrl.loadTemplate();
        await ctrl.loadThemes();
        await ctrl.loadTemplates();
        ctrl.createUrl = `/admin/template/create/${ctrl.theme.id}/${ctrl.folderType}`;
        // ctrl.template = ctrl.templates.filter(
        //   (m) => m.id == ctrl.templateId
        // )[0];
        // if (!ctrl.template && ctrl.templates) {
        //   ctrl.template = ctrl.templates[0];
        //   ctrl.templateId = ctrl.template.id;
        // }
        // if (ctrl.folderType && !ctrl.folderType) {
        //   var resp = await service.getSingle([
        //     "portal",
        //     themeId,
        //     ctrl.folderType,
        //   ]);
        //   if (resp && resp.success) {
        //     resp.data.fileName = "new";
        //     ctrl.templates.splice(0, 0, resp.data);

        //     $rootScope.isBusy = false;
        //     $scope.$apply();
        //   } else {
        //     if (resp) {
        //       $rootScope.showErrors(resp.errors);
        //       $rootScope.isBusy = false;
        //       $scope.$apply();
        //     }
        //   }
        // }
      };
      ctrl.loadTemplates = async function () {
        ctrl.request.folderType = ctrl.folderType;
        ctrl.request.themeId = ctrl.theme.id;
        ctrl.request.pageSize = 1000;
        let getTemplates = await service.getList(ctrl.request);
        ctrl.templates = getTemplates.data.items;
        if (!ctrl.templateId && ctrl.templates.length) {
          ctrl.template = ctrl.templates[0];
          ctrl.templateId = ctrl.templates[0].id;
          ctrl.selectedTemplate = ctrl.template;
        }
        $scope.$apply();
      };
      ctrl.loadThemes = async () => {
        let getThemes = await themeService.getList(ctrl.themeRequest);
        ctrl.themes = getThemes.data.items;
        ctrl.theme = !ctrl.templateId
          ? ctrl.themes[0]
          : ctrl.themes.filter((m) => m.id == ctrl.template.mixThemeId)[0];
      };
      ctrl.loadTemplate = async () => {
        if (ctrl.templateId) {
          var resp = await service.getSingle([ctrl.templateId], {
            folderType: $scope.folderType,
          });
          if (resp && resp.success) {
            ctrl.selectedTemplate = resp.data;
            ctrl.template = resp.data;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
      };
    },
  ],
});
