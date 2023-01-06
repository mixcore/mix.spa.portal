sharedComponents.component("mixColumnEditor", {
  templateUrl:
    "/mix-app/views/app-shared/components/mix-column-editor/view.html",
  bindings: {
    model: "=",
    column: "=",
    intParentId: "=?",
    guidParentId: "=?",
    isShowTitle: "=?",
    inputClass: "=?",
    createUrl: "=?",
    updateUrl: "=?",
    backUrl: "=?",
    level: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "ngAppSettings",
    "$filter",
    "ApiService",
    function (
      $rootScope,
      $scope,
      $location,
      ngAppSettings,
      $filter,
      apiService
    ) {
      var ctrl = this;
      ctrl.jsonObj = null;
      ctrl.mediaFile = {};
      ctrl.icons = ngAppSettings.icons;
      ctrl.previousValue = null;
      ctrl.translate = (keyword, isWrap, defaultText) => {
        return $rootScope.translate(keyword, isWrap, defaultText);
      };

      ctrl.refData = null;
      ctrl.defaultDataModel = null;

      ctrl.refDataModel = {
        id: null,
        data: null,
      };

      ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
      ctrl.previousId = null;
      ctrl.options = [];
      ctrl.$onInit = async function () {
        if (!ctrl.createUrl && ctrl.model && ctrl.column.referenceId) {
          ctrl.buildCreateUrl();
        }
        if (!ctrl.updateUrl) {
          ctrl.updateUrl = "/admin/mix-database-data/details";
        }
        if (ctrl.model && ctrl.column.isSelect) {
          // Load options from system configutation by name if exist else load options from column configurations
          if (ctrl.column.columnConfigurations.optionsConfigurationName) {
            // load options if not belong to other column value
            let belongTo = ctrl.column.columnConfigurations.belongTo;
            let endpoint =
              ctrl.column.columnConfigurations.optionsConfigurationName;
            if (!belongTo) {
              let options = await apiService.getApiResult({
                url: endpoint,
              });
              ctrl.options = options;
            } else {
              //   ctrl.options = options.filter(
              //     (m) => m[belongTo] == ctrl.model[belongTo]
              //   );
              $rootScope.$watch(
                () => {
                  return ctrl.model[belongTo];
                },
                async function (newVal, oldVal) {
                  if (newVal != oldVal) {
                    if (!ctrl.allOptions) {
                      ctrl.allOptions = await apiService.getApiResult({
                        url: endpoint,
                      });
                    }
                    ctrl.options = ctrl.allOptions.filter(
                      (m) => m[belongTo] == ctrl.model[belongTo]
                    );
                  }
                }
              );
            }
          } else {
            ctrl.options = ctrl.column.options;
          }
        }

        ctrl.watchId();
      };
      ctrl.watchId = function () {
        $rootScope.$watch(
          () => {
            if (ctrl.model) {
              return ctrl.model.id;
            }
          },
          async function (newVal, oldVal) {
            if (newVal != oldVal) {
              ctrl.buildCreateUrl();
            }
          }
        );
      };
      ctrl.buildCreateUrl = function () {
        var backUrl = encodeURIComponent(`${$location.url()}`);
        ctrl.createUrl = `/admin/mix-database-data/create?mixDatabaseId=${ctrl.column.referenceId}&dataContentId=default&guidParentId=${ctrl.model.id}&parentType=Set&backUrl=${backUrl}`;
      };
      ctrl.initData = async function () {
        setTimeout(() => {
          switch (ctrl.column.dataType.toLowerCase()) {
            case "datetime":
            case "date":
            case "time":
              if (ctrl.model[ctrl.column.systemName]) {
                ctrl.dateObj = new Date(ctrl.model[ctrl.column.systemName]);
              }
              break;
            case "json":
              if (ctrl.model[ctrl.column.systemName]) {
                ctrl.jsonObj = JSON.parse(ctrl.model[ctrl.column.systemName]);
                ctrl.jsonContent = JSON.stringify(ctrl.jsonObj, null, "\t");
              } else {
                ctrl.jsonObj = JSON.parse(ctrl.column.defaultValue);
                ctrl.jsonContent = JSON.stringify(ctrl.jsonObj, null, "\t");
              }
              break;
            case "array":
              if (ctrl.model[ctrl.column.systemName]) {
                ctrl.jsonObj = JSON.parse(ctrl.model[ctrl.column.systemName]);
                ctrl.arrayContent = JSON.stringify(ctrl.jsonObj, null, "\t");
              } else {
                ctrl.jsonObj = JSON.parse(ctrl.column.defaultValue);
                ctrl.arrayContent = JSON.stringify(ctrl.jsonObj, null, "\t");
              }
              break;
            case "reference": // reference
              // if(ctrl.column.referenceId && ctrl.model.id){
              //     ctrl.model[ctrl.column.systemName] = ctrl.column.referenceId;
              //     navService.getSingle(['default']).then(resp=>{
              //         resp.mixDatabaseId = ctrl.column.referenceId;
              //         resp.parentId = ctrl.parentId;
              //         resp.parentType = ctrl.parentType;
              //         ctrl.defaultDataModel = resp;
              //         ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
              //     });
              //     ctrl.loadRefData();
              // }
              break;
            case "boolean":
              if (
                ctrl.column &&
                ctrl.column.defaultValue &&
                !ctrl.model[ctrl.column.systemName]
              ) {
                ctrl.model[ctrl.column.systemName] = JSON.parse(
                  ctrl.column.defaultValue
                );
                $scope.$apply();
              }
              break;
            default:
              if (ctrl.column && !ctrl.model[ctrl.column.systemName]) {
                ctrl.model[ctrl.column.systemName] = ctrl.column.defaultValue;
                $scope.$apply();
              }
              break;
          }
        }, 200);
      };
      ctrl.parseEncryptedData = function (data) {
        var encryptedData = $rootScope.testJSON(data);
        return $rootScope.decrypt(encryptedData);
      };
      ctrl.initDefaultValue = async function () {
        switch (ctrl.column.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.column.defaultValue) {
              ctrl.dateObj = new Date(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
            }
            break;
          case "double":
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.systemName] = parseFloat(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
            }
            break;
          case "boolean":
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.systemName] =
                ctrl.mixDatabaseDataValue.column.defaultValue == "true";
            }
            break;

          default:
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.systemName] = ctrl.column.defaultValue;
            }
            break;
        }
      };
      ctrl.updateJsonContent = function (content) {
        // mysql connector not support Jobject
        ctrl.model[ctrl.column.systemName] = content;
        // $scope.$apply();
      };
      ctrl.updateValue = function () {
        switch (ctrl.column.dataType.toLowerCase()) {
          case "datetime":
            if (ctrl.dateObj) {
              ctrl.model[ctrl.column.systemName] =
                ctrl.dateObj.toLocaleString();
            }
            break;
          case "date":
            if (ctrl.dateObj) {
              ctrl.model[ctrl.column.systemName] =
                ctrl.dateObj.toLocaleDateString();
            }
            break;
          case "time":
            if (ctrl.dateObj) {
              ctrl.model[ctrl.column.systemName] =
                ctrl.dateObj.toLocaleTimeString("en-GB");
            }
            break;
          default:
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.systemName] = ctrl.column.defaultValue;
            }
            break;
        }
      };
    },
  ],
});
