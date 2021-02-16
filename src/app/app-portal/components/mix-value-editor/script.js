modules.component("mixValueEditor", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-value-editor/view.html",
  bindings: {
    title: "=?",
    isSelect: "=?",
    stringValue: "=",
    type: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "$location",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, ngAppSettings, $location, dataService) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      ctrl.refData = [];
      ctrl.refRequest = angular.copy(ngAppSettings.request);
      ctrl.refRequest.pageSize = 100;
      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.previousId = null;
      ctrl.initData = async function () {
        setTimeout(() => {
          switch (ctrl.type) {
            case "datetime":
            case "date":
            case "time":
              if (ctrl.stringValue) {
                ctrl.dateObj = new Date(ctrl.stringValue);
                $scope.$apply();
              }
              break;
            case "boolean":
              if (ctrl.stringValue) {
                ctrl.booleanValue = ctrl.stringValue == "true";
              }
              break;

            case "reference": // reference
              if (ctrl.referenceId) {
                ctrl.refRequest.mixDatabaseId = ctrl.referenceId;
                ctrl.refRequest.parentType = ctrl.parentType;
                ctrl.refRequest.parentId = ctrl.parentId;

                dataService.getList(ctrl.refRequest).then((resp) => {
                  if (resp) {
                    ctrl.refData = resp;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                  } else {
                    if (resp) {
                      $rootScope.showErrors("Failed");
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                  }
                });
              }
              break;
            default:
              if (ctrl.isEncrypt && ctrl.encryptValue) {
                var encryptedData = {
                  key: ctrl.encryptKey,
                  data: ctrl.encryptValue,
                };
                ctrl.stringValue = $rootScope.decrypt(encryptedData);
              }
              break;
          }
        }, 200);
      };
      ctrl.updateStringValue = async function (dataType) {
        switch (dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.dateObj != null) {
              ctrl.stringValue = ctrl.dateObj.toISOString();
            } else {
              ctrl.stringValue = null;
            }
            break;
          case "double":
            // ctrl.stringValue = ctrl.doubleValue;
            break;
          case "boolean":
            // ctrl.stringValue = ctrl.booleanValue;
            break;

          default:
            ctrl.stringValue = ctrl.doubleValue;
            break;
        }
      };
      ctrl.updateRefData = function (item) {
        $location.url(
          "/portal/mix-database-data/details?dataId=" +
            item.id +
            "&mixDatabaseId=" +
            item.mixDatabaseId +
            "&parentType=" +
            item.parentType +
            "&parentId=" +
            item.parentId
        );
      };
      ctrl.removeRefData = async function (data) {
        $rootScope.showConfirm(
          ctrl,
          "removeRefDataConfirmed",
          [data.id],
          null,
          "Remove",
          "Deleted data will not able to recover, are you sure you want to delete this item?"
        );
      };
      ctrl.removeRefDataConfirmed = async function (dataId) {
        $rootScope.isBusy = true;
        var result = await dataService.delete(dataId);
        if (result.isSucceed) {
          $rootScope.removeObjectByKey(ctrl.refData, "id", dataId);
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
