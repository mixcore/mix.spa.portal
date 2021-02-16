modules.component("attributeValueEditor", {
  templateUrl :
      "/mix-app/views/app-portal/components/attribute-value-editor/view.html",
  bindings : {
    attributeValue : "=?",
    parentType : "=?",
    parentId : "=?",
    isShowTitle : "=?",
  },
  controller : [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "$location",
    "RestRelatedMixDatabasePortalService",
    "RestMixDatabaseDataPortalService",
    function($rootScope, $scope, ngAppSettings, $location, navService,
             dataService) {
      var ctrl = this;
      ctrl.goToPath = $rootScope.goToPath;
      ctrl.icons = ngAppSettings.icons;
      ctrl.refData = null;
      ctrl.defaultDataModel = null;
      ctrl.refDataModel = {
        id : null,
        data : null,
      };
      ctrl.refRequest = angular.copy(ngAppSettings.request);
      ctrl.refRequest.pageSize = 100;
      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.previousId = null;
      ctrl.$doCheck = function() {
        if (ctrl.attributeValue && ctrl.previousId !== ctrl.attributeValue.id) {
          ctrl.previousId = ctrl.attributeValue.id;
          ctrl.initData();
        }
      }.bind(ctrl);
      ctrl.$onInit = function() { ctrl.initData(); };
      ctrl.initData = async function() {
        setTimeout(() => {
          if (!ctrl.attributeValue.id) {
            ctrl.initDefaultValue();
          }
          switch (ctrl.attributeValue.dataType.toLowerCase()) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.attributeValue.dateTimeValue) {
              ctrl.attributeValue.dateObj =
                  new Date(ctrl.attributeValue.dateTimeValue);
              $scope.$apply();
            }
            break;
          case "reference": // reference
            if (ctrl.attributeValue.field.referenceId && ctrl.parentId) {
              ctrl.attributeValue.integerValue =
                  ctrl.attributeValue.field.referenceId;
              // navService.getSingle(["default"]).then((resp) => {
              //   ctrl.defaultDataModel = resp;
              //   ctrl.defaultDataModel.mixDatabaseId =
              //     ctrl.attributeValue.field.referenceId;
              //   ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
              // });
              // ctrl.loadRefData();
            }
            break;
          default:
            if (ctrl.attributeValue.field &&
                ctrl.attributeValue.field.isEncrypt &&
                ctrl.attributeValue.encryptValue) {
              var encryptedData = {
                key : ctrl.attributeValue.encryptKey,
                data : ctrl.attributeValue.encryptValue,
              };
              ctrl.attributeValue.stringValue =
                  $rootScope.decrypt(encryptedData);
            }
            if (ctrl.attributeValue.field && !ctrl.attributeValue.stringValue) {
              ctrl.attributeValue.stringValue =
                  ctrl.attributeValue.field.defaultValue;
              $scope.$apply();
            }
            break;
          }
        }, 200);
      };
      ctrl.initDefaultValue = async function() {
        switch (ctrl.attributeValue.dataType) {
        case "datetime":
        case "date":
        case "time":
          if (ctrl.attributeValue.field.defaultValue) {
            ctrl.attributeValue.dateObj =
                new Date(ctrl.attributeValue.field.defaultValue);
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.field.defaultValue;
          }
          break;
        case "double":
          if (ctrl.attributeValue.field.defaultValue) {
            ctrl.attributeValue.doubleValue =
                parseFloat(ctrl.attributeValue.field.defaultValue);
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.field.defaultValue;
          }
          break;
        case "boolean":
          if (ctrl.attributeValue.field.defaultValue) {
            ctrl.attributeValue.booleanValue =
                ctrl.attributeValue.field.defaultValue == "true";
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.field.defaultValue;
          }
          break;

        default:
          if (ctrl.attributeValue.field.defaultValue) {
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.field.defaultValue;
          }
          break;
        }
      };
      ctrl.updateStringValue = async function(dataType) {
        switch (dataType.toLowerCase()) {
        case "datetime":
        case "date":
        case "time":
          if (ctrl.attributeValue.dateObj) {
            ctrl.attributeValue.dateTimeValue =
                ctrl.attributeValue.dateObj.toISOString();
            ctrl.attributeValue.stringValue = ctrl.attributeValue.dateTimeValue;
          }
          break;
        case "double":
          if (ctrl.attributeValue.doubleValue) {
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.doubleValue.toString();
          }
          break;
        case "boolean":
          if (ctrl.attributeValue.booleanValue != null) {
            ctrl.attributeValue.stringValue =
                ctrl.attributeValue.booleanValue.toString();
          }
          break;

        default:
          break;
        }
      };

      ctrl.updateRefData = function(nav) {
        ctrl.goToPath(`/portal/mix-database-data/details?dataId=${nav.data.id}
                &mixDatabaseId=${nav.data.mixDatabaseId}
                &parentId=${ctrl.parentId}
                &parentType=${ctrl.parentType}`);
        // ctrl.refDataModel = nav;
        // var e = $(".pane-form-" + ctrl.attributeValue.field.referenceId)[0];
        // angular.element(e).triggerHandler('click');
        // $location.url('/portal/mix-database-data/details?dataId='+ item.id
        // +'&mixDatabaseId=' + item.mixDatabaseId+'&parentType=' +
        // item.parentType+'&parentId=' + item.parentId);
      };

      ctrl.removeRefData = async function(nav) {
        $rootScope.showConfirm(
            ctrl, "removeRefDataConfirmed", [ nav ], null, "Remove",
            "Deleted data will not able to recover, are you sure you want to delete this item?");
      };
      ctrl.removeRefDataConfirmed = async function(nav) {
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
