modules.component("navigationForm", {
  templateUrl:
    "/mix-app/views/app-portal/pages/navigation/components/navigation-form/view.html",
  bindings: {
    attributeSetId: "=",
    attributeSetName: "=",
    fields: "=?",
    attrDataId: "=?",
    attrData: "=?",
    parentType: "=?", // attribute set = 1 | post = 2 | page = 3 | module = 4
    parentId: "=?",
    defaultId: "=",
    saveData: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    "RestAttributeSetDataPortalService",
    "RestAttributeFieldPortalService",
    function ($rootScope, $scope, $routeParams, service, fieldService) {
      var ctrl = this;
      ctrl.isBusy = false;
      ctrl.attributes = [];
      ctrl.selectedList = {
        action: "",
        data: [],
      };
      ctrl.defaultData = null;
      ctrl.selectedProp = null;
      ctrl.settings = $rootScope.globalSettings;

      // ctrl.$onInit = async function () {
      //     ctrl.loadData();
      // };
      ctrl.loadData = async function () {
        /*
                    If input is data id => load ctrl.attrData from service and handle it independently
                    Else modify input ctrl.attrData
                */
        $rootScope.isBusy = true;

        if (ctrl.attrDataId) {
          var getData = await service.getSingle([ctrl.attrDataId]);
          ctrl.attrData = getData.data;
          if (ctrl.attrData) {
            ctrl.attributeSetId = ctrl.attrData.attributeSetId;
            ctrl.attributeSetName = ctrl.attrData.attributeSetName;
            await ctrl.loadDefaultModel();
            ctrl.createMenuUrl = `/portal/navigation/create?attributeSetId=1&dataId=default&parentId=${ctrl.attrData.id}&parentType=1`;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (ctrl.attrData) {
              $rootScope.showErrors("Failed");
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
        if (ctrl.attributeSetName || ctrl.attributeSetId) {
          await ctrl.loadDefaultModel();
          $rootScope.isBusy = false;
        }
      };
      ctrl.loadDefaultModel = async function () {
        if ($routeParams.parentId) {
          ctrl.parentId = $routeParams.parentId;
        }
        if ($routeParams.parentType) {
          ctrl.parentType = $routeParams.parentType;
        }
        if (!ctrl.fields) {
          var getFields = await fieldService.initData(
            ctrl.attributeSetName || ctrl.attributeSetId
          );
          if (getFields.isSucceed) {
            ctrl.fields = getFields.data;
            $scope.$apply();
          }
        }
        var getDefault = await service.initData(
          ctrl.attributeSetName || ctrl.attributeSetId
        );
        ctrl.defaultData = getDefault.data;
        if (ctrl.defaultData) {
          ctrl.defaultData.attributeSetId = ctrl.attributeSetId || 0;
          ctrl.defaultData.attributeSetName = ctrl.attributeSetName;
          ctrl.defaultData.parentId = ctrl.parentId;
          ctrl.defaultData.parentType = ctrl.parentType;
          $rootScope.isBusy = false;
          $scope.$apply();
        }

        if (!ctrl.attrData) {
          ctrl.attrData = angular.copy(ctrl.defaultData);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.reload = async function () {
        ctrl.attrData = angular.copy(ctrl.defaultData);
      };
      ctrl.showContentFilter = function ($event) {
        $rootScope.showContentFilter(ctrl.loadSelected);
      };
      ctrl.loadSelected = function (data, type) {
        if (data) {
          ctrl.attrData.obj.target_id = data.id;
          ctrl.attrData.obj.title = data.title;
          ctrl.attrData.obj.type = type;
          ctrl.attrData.obj.uri = data.detailsUrl;
        }
      };
      ctrl.submit = async function () {
        if (ctrl.validate()) {
          if (ctrl.saveData) {
            ctrl.isBusy = true;
            var result = await ctrl.saveData({
              data: ctrl.attrData,
            });
            if (result && result.isSucceed) {
              ctrl.isBusy = false;
              ctrl.attrData = result.data;
              $scope.$apply();
            } else {
              ctrl.isBusy = false;
              // ctrl.attrData = await service.getSingle('portal', [ctrl.defaultId, ctrl.attributeSetId, ctrl.attributeSetName]);
              $scope.$apply();
            }
          } else {
            ctrl.isBusy = true;

            var saveResult = await service.save(ctrl.attrData);
            if (saveResult.isSucceed) {
              ctrl.attrData.id = saveResult.data.id;
              ctrl.isBusy = false;
              $scope.$apply();
            } else {
              ctrl.isBusy = false;
              if (saveResult) {
                $rootScope.showErrors(saveResult.errors);
              }
              $scope.$apply();
            }
          }
        }
      };
      ctrl.validate = function () {
        var isValid = true;
        ctrl.errors = [];
        angular.forEach(ctrl.fields, function (field) {
          if (field.regex) {
            var regex = RegExp(field.regex, "g");
            isValid = regex.test(ctrl.attrData.data[field.name]);
            if (!isValid) {
              ctrl.errors.push(`${field.name} is not match Regex`);
            }
          }
          if (isValid && field.isEncrypt) {
            ctrl.attrData.data[field.name] = $rootScope.encrypt(
              ctrl.attrData.data[field.name]
            );
          }
        });
        return isValid;
      };
      ctrl.filterData = function (attributeName) {
        if (ctrl.attrData) {
          var attr = $rootScope.findObjectByKey(
            ctrl.attrData.data,
            "attributeFieldName",
            attributeName
          );
          if (!attr) {
            attr = angular.copy(
              $rootScope.findObjectByKey(
                ctrl.defaultData.data,
                "attributeFieldName",
                attributeName
              )
            );
            ctrl.attrData.data.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
