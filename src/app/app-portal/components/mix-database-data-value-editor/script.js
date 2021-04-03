modules.component("mixDatabaseDataValueEditor", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-data-value-editor/view.html",
  bindings: {
    mixDatabaseDataValue: "=?",
    parentType: "=?",
    parentId: "=?",
    isShowTitle: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "$location",
    "RestRelatedMixDatabasePortalService",
    "RestMixDatabaseDataPortalService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      $location,
      navService,
      dataService
    ) {
      var ctrl = this;
      ctrl.goToPath = $rootScope.goToPath;
      ctrl.icons = ngAppSettings.icons;
      ctrl.refData = null;
      ctrl.defaultDataModel = null;
      ctrl.refDataModel = {
        id: null,
        data: null,
      };
      ctrl.refRequest = angular.copy(ngAppSettings.request);
      ctrl.refRequest.pageSize = 100;
      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.previousId = null;
      ctrl.$doCheck = function () {
        if (
          ctrl.mixDatabaseDataValue &&
          ctrl.previousId !== ctrl.mixDatabaseDataValue.id
        ) {
          ctrl.previousId = ctrl.mixDatabaseDataValue.id;
          ctrl.initData();
        }
      }.bind(ctrl);
      ctrl.$onInit = function () {
        ctrl.initData();
      };
      ctrl.initData = async function () {
        setTimeout(() => {
          if (!ctrl.mixDatabaseDataValue.id) {
            ctrl.initDefaultValue();
          }
          switch (ctrl.mixDatabaseDataValue.dataType.toLowerCase()) {
            case "datetime":
            case "date":
            case "time":
              if (ctrl.mixDatabaseDataValue.dateTimeValue) {
                ctrl.mixDatabaseDataValue.dateObj = new Date(
                  ctrl.mixDatabaseDataValue.dateTimeValue
                );
                $scope.$apply();
              }
              break;
            case "reference": // reference
              if (
                ctrl.mixDatabaseDataValue.column.referenceId &&
                ctrl.parentId
              ) {
                ctrl.mixDatabaseDataValue.integerValue =
                  ctrl.mixDatabaseDataValue.column.referenceId;
                // navService.getSingle(["default"]).then((resp) => {
                //   ctrl.defaultDataModel = resp;
                //   ctrl.defaultDataModel.mixDatabaseId =
                //     ctrl.mixDatabaseDataValue.column.referenceId;
                //   ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
                // });
                // ctrl.loadRefData();
              }
              break;
            default:
              if (
                ctrl.mixDatabaseDataValue.column &&
                ctrl.mixDatabaseDataValue.column.isEncrypt &&
                ctrl.mixDatabaseDataValue.encryptValue
              ) {
                var encryptedData = {
                  key: ctrl.mixDatabaseDataValue.encryptKey,
                  data: ctrl.mixDatabaseDataValue.encryptValue,
                };
                ctrl.mixDatabaseDataValue.stringValue = $rootScope.decrypt(
                  encryptedData
                );
              }
              if (
                ctrl.mixDatabaseDataValue.column &&
                !ctrl.mixDatabaseDataValue.stringValue
              ) {
                ctrl.mixDatabaseDataValue.stringValue =
                  ctrl.mixDatabaseDataValue.column.defaultValue;
                $scope.$apply();
              }
              break;
          }
        }, 200);
      };
      ctrl.initDefaultValue = async function () {
        switch (ctrl.mixDatabaseDataValue.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.mixDatabaseDataValue.column.defaultValue) {
              ctrl.mixDatabaseDataValue.dateObj = new Date(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
              ctrl.mixDatabaseDataValue.stringValue =
                ctrl.mixDatabaseDataValue.column.defaultValue;
            }
            break;
          case "double":
            if (ctrl.mixDatabaseDataValue.column.defaultValue) {
              ctrl.mixDatabaseDataValue.doubleValue = parseFloat(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
              ctrl.mixDatabaseDataValue.stringValue =
                ctrl.mixDatabaseDataValue.column.defaultValue;
            }
            break;
          case "boolean":
            if (ctrl.mixDatabaseDataValue.column.defaultValue) {
              ctrl.mixDatabaseDataValue.booleanValue =
                ctrl.mixDatabaseDataValue.column.defaultValue == "true";
              ctrl.mixDatabaseDataValue.stringValue =
                ctrl.mixDatabaseDataValue.column.defaultValue;
            }
            break;

          default:
            if (ctrl.mixDatabaseDataValue.column.defaultValue) {
              ctrl.mixDatabaseDataValue.stringValue =
                ctrl.mixDatabaseDataValue.column.defaultValue;
            }
            break;
        }
      };
      ctrl.updateStringValue = async function (dataType) {
        switch (dataType.toLowerCase()) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.mixDatabaseDataValue.dateObj) {
              ctrl.mixDatabaseDataValue.dateTimeValue = ctrl.mixDatabaseDataValue.dateObj.toISOString();
              ctrl.mixDatabaseDataValue.stringValue =
                ctrl.mixDatabaseDataValue.dateTimeValue;
            }
            break;
          case "double":
            if (ctrl.mixDatabaseDataValue.doubleValue) {
              ctrl.mixDatabaseDataValue.stringValue = ctrl.mixDatabaseDataValue.doubleValue.toString();
            }
            break;
          case "boolean":
            if (ctrl.mixDatabaseDataValue.booleanValue != null) {
              ctrl.mixDatabaseDataValue.stringValue = ctrl.mixDatabaseDataValue.booleanValue.toString();
            }
            break;

          default:
            break;
        }
      };

      ctrl.updateRefData = function (nav) {
        ctrl.goToPath(`/portal/mix-database-data/details?dataId=${nav.data.id}
                &mixDatabaseId=${nav.data.mixDatabaseId}
                &parentId=${ctrl.parentId}
                &parentType=${ctrl.parentType}`);
        // ctrl.refDataModel = nav;
        // var e = $(".pane-form-" + ctrl.mixDatabaseDataValue.column.referenceId)[0];
        // angular.element(e).triggerHandler('click');
        // $location.url('/portal/mix-database-data/details?dataId='+ item.id +'&mixDatabaseId=' + item.mixDatabaseId+'&parentType=' + item.parentType+'&parentId=' + item.parentId);
      };

      ctrl.removeRefData = async function (nav) {
        $rootScope.showConfirm(
          ctrl,
          "removeRefDataConfirmed",
          [nav],
          null,
          "Remove",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };
      ctrl.removeRefDataConfirmed = async function (nav) {
        $rootScope.isBusy = true;
        var result = await navService.delete([
          nav.parentId,
          nav.parentType,
          nav.id,
        ]);
        if (result.isSucceed) {
          $rootScope.removeObjectByKey(ctrl.refData, "id", nav.id);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showMessage("failed");
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
});
