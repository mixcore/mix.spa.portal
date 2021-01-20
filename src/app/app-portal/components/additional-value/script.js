modules.component("additionalValue", {
  templateUrl: "/mix-app/views/app-portal/components/additional-value/view.html",
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
    "RestAttributeSetDataPortalService",
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
              ctrl.additionalData.attributeSetName = ctrl.databaseName;
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

      ctrl.updateOrders = function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.fields.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.fields.splice(ctrl.dragStartIndex + 1, 1);
        }
        angular.forEach(ctrl.fields, function (e, i) {
          e.priority = i;
        });
      };

      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
      };

      ctrl.removeAttribute = function (val, index) {
        $rootScope.showConfirm(
          ctrl,
          "removeAttributeConfirmed",
          [val, index],
          null,
          "Remove Field",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };
      ctrl.removeAttributeConfirmed = async function (val, index) {
        if (val.id) {
          $rootScope.isBusy = true;
          var result = await valueService.delete([val.id]);
          if (result.isSucceed) {
            ctrl.model.additionalData.data.values.splice(index, 1);
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showErrors(result.errors);
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          ctrl.model.additionalData.data.values.splice(index, 1);
        }
      };
    },
  ],
});
