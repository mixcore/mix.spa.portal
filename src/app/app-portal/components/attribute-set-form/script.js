modules.component("attributeSetForm", {
  templateUrl: "/mix-app/views/app-portal/components/attribute-set-form/view.html",
  bindings: {
    attributeSetId: "=",
    attributeSetName: "=",
    fields: "=?",
    attrDataId: "=?",
    attrData: "=?",
    parentType: "=?", // attribute set = 1 | post = 2 | page = 3 | module = 4
    parentId: "=?",
    defaultId: "=",
    backUrl: "=?",
    hideAction: "=?",
    saveData: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "RestAttributeSetDataPortalService",
    "RestAttributeFieldPortalService",
    function (
      $rootScope,
      $scope,
      $location,
      $routeParams,
      service,
      fieldService
    ) {
      var ctrl = this;
      ctrl.isBusy = false;
      ctrl.attributes = [];

      ctrl.defaultData = null;
      ctrl.selectedProp = null;
      ctrl.settings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        ctrl.loadData();
      };
      ctrl.loadData = async function () {
        /*
                    If input is data id => load ctrl.attrData from service and handle it independently
                    Else modify input ctrl.attrData
                */
        ctrl.isBusy = true;

        if (ctrl.attrDataId) {
          var getData = await service.getSingle([ctrl.attrDataId]);
          ctrl.attrData = getData.data;
          if (ctrl.attrData) {
            ctrl.attrData.parentId = ctrl.parentId;
            ctrl.attrData.parentType = ctrl.parentType;
            ctrl.attributeSetId = ctrl.attrData.attributeSetId;
            ctrl.attributeSetName = ctrl.attrData.attributeSetName;
            await ctrl.loadDefaultModel();
            ctrl.isBusy = false;
            $scope.$apply();
          } else {
            if (getData) {
              $rootScope.showErrors(getData.errors);
            }
            ctrl.isBusy = false;
            $scope.$apply();
          }
        }
        if (
          (ctrl.attributeSetName || ctrl.attributeSetId) &&
          !ctrl.defaultData
        ) {
          await ctrl.loadDefaultModel();
          ctrl.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.loadDefaultModel = async function () {
        if ($routeParams.parentId) {
          ctrl.parentId = $routeParams.parentId;
        }
        if ($routeParams.parentType) {
          ctrl.parentType = $routeParams.parentType;
        }
        if (!ctrl.backUrl) {
          if (ctrl.parentType) {
            switch (ctrl.parentType) {
              case "Post":
              case "Page":
              case "Module":
                ctrl.backUrl = `/portal/${ctrl.parentType.toLowerCase()}/details/${ctrl.parentId
                  }`;
                break;

              default:
                ctrl.backUrl = `/portal/attribute-set-data/details?dataId=${ctrl.parentId}`;
                break;
            }
          } else {
            ctrl.backUrl = `/portal/attribute-set-data/list?attributeSetId=${ctrl.attributeSetId}&attributeSetName=${ctrl.attributeSetName}`;
          }
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
        }

        if (!ctrl.attrData) {
          ctrl.attrData = angular.copy(ctrl.defaultData);
        }
      };

      ctrl.reload = async function () {
        ctrl.attrData = angular.copy(ctrl.defaultData);
      };
      ctrl.loadSelected = function () {
        if (ctrl.selectedList.data.length) {
          ctrl.attrData = ctrl.selectedList.data[0];
          ctrl.attrData.attributeSetId = ctrl.attributeSetId;
          ctrl.attrData.attributeSetName = ctrl.attributeSetName;
          ctrl.attrData.parentId = ctrl.parentId;
          ctrl.attrData.parentType = ctrl.parentType;
        }
      };
      ctrl.submit = async function () {
        if (ctrl.validate()) {
          if (ctrl.saveData) {
            ctrl.isBusy = true;
            var result = await ctrl.saveData({ data: ctrl.attrData });
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
              $rootScope.showMessage("success");
              if ($location.path() == "/portal/attribute-set-data/create") {
                const url =
                  ctrl.backUrl ||
                  `/portal/attribute-set-data/details?dataId=${ctrl.attrData.id}`;
                $location.url(url);
              }
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
            isValid = regex.test(ctrl.attrData.obj[field.name]);
            if (!isValid) {
              ctrl.errors.push(`${field.name} is not match Regex`);
            }
          }
          if (!isValid) {
            $rootScope.showErrors(ctrl.errors);
          }
          if (isValid && field.isEncrypt) {
            ctrl.attrData.obj[field.name] = $rootScope.encrypt(
              ctrl.attrData.obj[field.name]
            );
          }
        });
        return isValid;
      };
      ctrl.filterData = function (attributeName) {
        if (ctrl.attrData) {
          var attr = $rootScope.findObjectByKey(
            ctrl.attrData.obj,
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
            ctrl.attrData.obj.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
