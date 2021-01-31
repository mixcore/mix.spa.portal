modules.component("mixFieldEditor", {
  templateUrl: "/mix-app/views/app-shared/components/mix-field-editor/view.html",
  bindings: {
    model: "=",
    field: "=",
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
    "RestRelatedAttributeDataPortalService",
    function (
      $rootScope,
      $scope,
      $location,
      ngAppSettings,
      $filter,
      navService
    ) {
      var ctrl = this;
      ctrl.icons = ngAppSettings.icons;
      ctrl.previousValue = null;
      ctrl.translate = (keyword, isWrap, defaultText) => {
        return $rootScope.translate(keyword, isWrap, defaultText);
      };
      ctrl.$doCheck = function () {
        // Generate seo string if create new or not exist
        if (
          ctrl.model &&
          (!ctrl.model.id || !ctrl.model.obj["seo_url"]) &&
          ctrl.field.name == "title"
        ) {
          if (
            ctrl.model.obj[ctrl.field.name] &&
            ctrl.previousValue !== ctrl.model.obj[ctrl.field.name]
          ) {
            ctrl.previousValue = ctrl.model.obj[ctrl.field.name];
            ctrl.model.obj["seo_url"] = $rootScope.generateKeyword(
              ctrl.model.obj[ctrl.field.name],
              "-"
            );
          }
        }
        // check encrypt data
        if (
          ctrl.model &&
          ctrl.field &&
          ctrl.field.isEncrypt &&
          ctrl.model.obj[ctrl.field.name] &&
          $rootScope.testJSON(ctrl.model.obj[ctrl.field.name])
        ) {
          ctrl.model.obj[ctrl.field.name] = ctrl.parseEncryptedData(
            ctrl.model.obj[ctrl.field.name]
          );
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
      ctrl.$onInit = function () {
        if (!ctrl.createUrl && ctrl.model && ctrl.field.referenceId) {
          var backUrl =  encodeURIComponent($location.url());
          ctrl.createUrl = `/portal/attribute-set-data/create?attributeSetId=${
            ctrl.field.referenceId
          }&dataId=default&parentId=${
            ctrl.model.id
          }&parentType=Set&backUrl=${backUrl}`;
        }
        if (!ctrl.updateUrl) {
          ctrl.updateUrl = "/portal/attribute-set-data/details";
        }
      };
      ctrl.initData = async function () {
        setTimeout(() => {
          switch (ctrl.field.dataType.toLowerCase()) {
            case "datetime":
            case "date":
            case "time":
              if (ctrl.model.obj[ctrl.field.name]) {
                var local = $filter("utcToLocalTime")(
                  ctrl.model.obj[ctrl.field.name]
                );
                ctrl.model.obj[ctrl.field.name] = new Date(local);
                $scope.$apply();
              }
              break;
            case "reference": // reference
              // if(ctrl.field.referenceId && ctrl.model.id){
              //     ctrl.model[ctrl.field.name] = ctrl.field.referenceId;
              //     navService.getSingle(['default']).then(resp=>{
              //         resp.attributeSetId = ctrl.field.referenceId;
              //         resp.parentId = ctrl.parentId;
              //         resp.parentType = ctrl.parentType;
              //         ctrl.defaultDataModel = resp;
              //         ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
              //     });
              //     ctrl.loadRefData();
              // }
              break;
            default:
              if (ctrl.field && !ctrl.model[ctrl.field.name]) {
                ctrl.model[ctrl.field.name] = ctrl.field.defaultValue;
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
        switch (ctrl.field.dataType) {
          case "datetime":
          case "date":
          case "time":
            if (ctrl.field.defaultValue) {
              ctrl.model[ctrl.field.name] = new Date(
                ctrl.attributeValue.field.defaultValue
              );
            }
            break;
          case "double":
            if (ctrl.field.defaultValue) {
              ctrl.model[ctrl.field.name] = parseFloat(
                ctrl.attributeValue.field.defaultValue
              );
            }
            break;
          case "boolean":
            if (ctrl.field.defaultValue) {
              ctrl.model[ctrl.field.name] =
                ctrl.attributeValue.field.defaultValue == "true";
            }
            break;

          default:
            if (ctrl.field.defaultValue) {
              ctrl.model[ctrl.field.name] = ctrl.field.defaultValue;
            }
            break;
        }
      };
    },
  ],
});
