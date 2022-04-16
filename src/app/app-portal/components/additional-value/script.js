modules.component("additionalValue", {
  templateUrl:
    "/mix-app/views/app-portal/components/additional-value/view.html",
  bindings: {
    additionalData: "=?",
    additionalDataId: "=?",
    parentType: "=?",
    parentId: "=?",
    backUrl: "=?",
    databaseName: "=?",
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
      ctrl.localizeSettings = $rootScope.globalSettings;
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
