modules.component("mixDatabaseColumn", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-column/view.html",
  bindings: {
    column: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseColumnPortalService",
    function ($rootScope, $scope, columnService) {
      var ctrl = this;
      ctrl.value = {};
      ctrl.column = {
        dataType: "Text",
        mixDatabaseName: "sys_additional_column",
        mixDatabaseId: 6,
      };
      ctrl.selectedCol = null;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {};
      ctrl.addAttr = async function () {
        if (ctrl.column.name) {
          var current = $rootScope.findObjectByKey(
            ctrl.additionalData.columns,
            "name",
            ctrl.column.name
          );
          if (current) {
            $rootScope.showErrors(["Field " + ctrl.column.name + " existed!"]);
          } else {
            ctrl.column.priority = ctrl.additionalData.columns.length + 1;
            $rootScope.isBusy = true;
            var saveField = await columnService.create(ctrl.column);
            $rootScope.isBusy = false;
            if (saveField.isSucceed) {
              ctrl.additionalData.columns.push(saveField.data);

              //reset column option
              ctrl.column.title = "";
              ctrl.column.name = "";
              ctrl.column.dataType = "Text";
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
          ctrl.columns.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.columns.splice(ctrl.dragStartIndex + 1, 1);
        }
        angular.forEach(ctrl.columns, function (e, i) {
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
          var result = await columnService.delete([val.id]);
          if (result.isSucceed) {
            ctrl.additionalData.columns.splice(index, 1);
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showErrors(result.errors);
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          ctrl.additionalData.columns.splice(index, 1);
        }
      };
    },
  ],
});
