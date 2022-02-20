modules.component("additionalValue", {
  templateUrl:
    "/mix-app/views/app-portal/components/additional-value/view.html",
  bindings: {
    additionalData: "=?",
    additionalDataId: "=?",
    parentType: "=?",
    parentId: "=?",
    mixDatabaseName: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, dataService) {
      var ctrl = this;
      ctrl.value = {};
      ctrl.column = { dataType: "Text" };
      ctrl.selectedCol = null;
      ctrl.mixConfigurations = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        if (!ctrl.additionalData) {
          if (!ctrl.additionalDataId) {
            const obj = {
              parentType: ctrl.parentType,
              parentId: ctrl.parentId,
              databaseName: ctrl.mixDatabaseName,
            };
            const getData = await dataService.getAdditionalData(obj);
            if (getData.success) {
              ctrl.additionalData = getData.data;
              ctrl.additionalData.mixDatabaseName = ctrl.mixDatabaseName;
              ctrl.additionalData.parentType = ctrl.parentType;
              $scope.$apply();
            } else {
              $rootScope.showErrors(getData.errors);
            }
          } else {
            var getData = await dataService.getSingle([ctrl.additionalDataId]);
            ctrl.additionalData = getData.data;
            $scope.$apply();
          }
        }
      };
    },
  ],
});
