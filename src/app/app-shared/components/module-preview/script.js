sharedComponents.component("modulePreview", {
  templateUrl: "/mix-app/views/app-shared/components/module-preview/view.html",
  controller: [
    "$scope",
    "$rootScope",
    "ModuleDataRestService",
    function ($scope, $rootScope, moduleDataService) {
      var ctrl = this;
      $rootScope.isBusy = false;
      ctrl.previousContentId = undefined;

      this.$onInit = () => {
        ctrl.previousContentId = angular.copy(ctrl.contentId);
      };

      this.$doCheck = () => {
        if (ctrl.contentId !== ctrl.previousContentId) {
          ctrl.loadModuleData();
          ctrl.previousContentId = ctrl.contentId;
        }
      };

      ctrl.loadModuleData = async function () {
        $rootScope.isBusy = true;
        var response = await moduleDataService.getSingle([ctrl.contentId]);
        if (response.success) {
          ctrl.data = response.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
  bindings: {
    contentId: "=",
  },
});
