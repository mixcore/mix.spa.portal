modules.component("additionalField", {
  templateUrl:
    "/mix-app/views/app-portal/components/additional-field/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseColumnPortalService",
    function ($rootScope, $scope, fieldService) {
      var ctrl = this;
      ctrl.value = {};
      ctrl.field = {
        dataType: "Text",
        mixDatabaseName: "sys_additional_field",
        mixDatabaseId: 6,
      };
      ctrl.selectedCol = null;
      ctrl.settings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {};
      ctrl.addAttr = async function () {
        if (ctrl.field.name) {
          var current = $rootScope.findObjectByKey(
            ctrl.additionalData.fields,
            "name",
            ctrl.field.name
          );
          if (current) {
            $rootScope.showErrors(["Field " + ctrl.field.name + " existed!"]);
          } else {
            ctrl.field.priority = ctrl.additionalData.fields.length + 1;
            $rootScope.isBusy = true;
            var saveField = await fieldService.create(ctrl.field);
            $rootScope.isBusy = false;
            if (saveField.isSucceed) {
              ctrl.additionalData.fields.push(saveField.data);

              // reset field option
              ctrl.field.title = "";
              ctrl.field.name = "";
              ctrl.field.dataType = "Text";
              $scope.$apply();
            }
          }
        } else {
          $rootScope.showErrors(["Please add column Name"]);
        }
      };

      ctrl.generateName = function (col) {
        col.name = $rootScope.generateKeyword(col.title, "_");
      };
      ctrl.showReferences = function (col) {
        ctrl.colRef = col;
        $("#modal-navs").modal("show");
      };
      ctrl.referenceCallback = function (selected) {
        if (selected && selected.length) {
          ctrl.colRef.reference = selected;
          ctrl.colRef.referenceId = selected[0].id;
        }
        $("#modal-navs").modal("hide");
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
          var result = await fieldService.delete([val.id]);
          if (result.isSucceed) {
            ctrl.additionalData.fields.splice(index, 1);
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showErrors(result.errors);
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          ctrl.additionalData.fields.splice(index, 1);
        }
      };
    },
  ],
});
