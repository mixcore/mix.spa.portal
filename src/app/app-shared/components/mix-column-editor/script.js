sharedComponents.component("mixColumnEditor", {
  templateUrl:
    "/mix-app/views/app-shared/components/mix-column-editor/view.html",
  bindings: {
    model: "=",
    column: "=",
    parentId: "=?",
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
    "$routeParams",
    "ngAppSettings",
    "$filter",
    "ApiService",
    function (
      $rootScope,
      $scope,
      $routeParams,
      ngAppSettings,
      $filter,
      apiService
    ) {
      var ctrl = this;
      ctrl.mediaFile = {};
      ctrl.icons = ngAppSettings.icons;
      ctrl.previousValue = null;
      ctrl.translate = (keyword, isWrap, defaultText) => {
        return $rootScope.translate(keyword, isWrap, defaultText);
      };
      ctrl.$doCheck = function () {
        // Generate seo string if create new or not exist
        if (
          ctrl.column &&
          ctrl.model &&
          (!ctrl.model.id || !ctrl.model.obj["seo_url"]) &&
          ctrl.column.name == "title"
        ) {
          if (
            ctrl.model.obj[ctrl.column.name] &&
            ctrl.previousValue !== ctrl.model.obj[ctrl.column.name]
          ) {
            ctrl.previousValue = ctrl.model.obj[ctrl.column.name];
            ctrl.model.obj["seo_url"] = $rootScope.generateKeyword(
              ctrl.model.obj[ctrl.column.name],
              "-"
            );
          }
        }
        if (ctrl.model && ctrl.column) {
          // check encrypt data
          if (
            ctrl.column.isEncrypt &&
            ctrl.model.obj[ctrl.column.name] &&
            $rootScope.testJSON(ctrl.model.obj[ctrl.column.name])
          ) {
            ctrl.model.obj[ctrl.column.name] = ctrl.parseEncryptedData(
              ctrl.model.obj[ctrl.column.name]
            );
          }
        }
      }.bind(ctrl);
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
          ctrl.updateUrl = "/portal/mix-database-data/details";
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
              //     (m) => m[belongTo] == ctrl.model.obj[belongTo]
              //   );
              $rootScope.$watch(
                () => {
                  return ctrl.model.obj[belongTo];
                },
                async function (newVal, oldVal) {
                  if (newVal != oldVal) {
                    if (!ctrl.allOptions) {
                      ctrl.allOptions = await apiService.getApiResult({
                        url: endpoint,
                      });
                    }
                    ctrl.options = ctrl.allOptions.filter(
                      (m) => m[belongTo] == ctrl.model.obj[belongTo]
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
        ctrl.createUrl = `/portal/mix-database-data/create?mixDatabaseId=${ctrl.column.referenceId}&dataId=default&parentId=${ctrl.model.id}&parentType=Set`;
      };
      ctrl.initData = async function () {
        setTimeout(() => {
          switch (ctrl.column.dataType.toLowerCase()) {
            case "datetime":
            case "date":
            case "time":
              if (ctrl.model.obj[ctrl.column.name]) {
                ctrl.obj = new Date(ctrl.model.obj[ctrl.column.name]);
              }
              break;
            case "reference": // reference
              // if(ctrl.column.referenceId && ctrl.model.id){
              //     ctrl.model[ctrl.column.name] = ctrl.column.referenceId;
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
            default:
              if (ctrl.column && !ctrl.model[ctrl.column.name]) {
                ctrl.model[ctrl.column.name] = ctrl.column.defaultValue;
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
              ctrl.obj = new Date(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
            }
            break;
          case "double":
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.name] = parseFloat(
                ctrl.mixDatabaseDataValue.column.defaultValue
              );
            }
            break;
          case "boolean":
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.name] =
                ctrl.mixDatabaseDataValue.column.defaultValue == "true";
            }
            break;

          default:
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.name] = ctrl.column.defaultValue;
            }
            break;
        }
      };
      ctrl.updateJsonContent = function (content) {
        ctrl.model.obj[ctrl.column.name] = JSON.parse(content);
        $scope.$apply();
      };
      ctrl.updateValue = function () {
        switch (ctrl.column.dataType.toLowerCase()) {
          case "datetime":
            if (ctrl.obj) {
              ctrl.model.obj[ctrl.column.name] = ctrl.obj.toLocaleString();
            }
            break;
          case "date":
            if (ctrl.obj) {
              ctrl.model.obj[ctrl.column.name] = ctrl.obj.toLocaleDateString();
            }
            break;
          case "time":
            if (ctrl.obj) {
              ctrl.model.obj[ctrl.column.name] =
                ctrl.obj.toLocaleTimeString("en-GB");
            }
            break;
          default:
            if (ctrl.column.defaultValue) {
              ctrl.model[ctrl.column.name] = ctrl.column.defaultValue;
            }
            break;
        }
      };
    },
  ],
});
