modules.component("additionalValue", {
  templateUrl:
    "/mix-app/views/app-portal/components/additional-value/view.html",
  bindings: {
    additionalData: "=?",
    additionalDataId: "=?",
    parentType: "=?",
    parentId: "=?",
    databaseName: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseDataPortalService",
    "RestAttributeValuePortalService",
    function ($rootScope, $scope, dataService, valueService) {
      var ctrl = this;
      ctrl.value = {};
      ctrl.field = { dataType: "Text" };
      ctrl.selectedCol = null;
      ctrl.settings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        if (!ctrl.additionalData) {
          if (!ctrl.additionalDataId) {
            const obj = {
              parentType: ctrl.parentType,
              parentId: ctrl.parentId,
              databaseName: ctrl.databaseName,
            };
            const getData = await dataService.getAdditionalData(obj);
            if (getData.isSucceed) {
              ctrl.additionalData = getData.data;
              ctrl.additionalData.mixDatabaseName = ctrl.databaseName;
              ctrl.additionalData.parentType = ctrl.parentType;
              ctrl.additionalData.parentId = ctrl.parentId;
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
