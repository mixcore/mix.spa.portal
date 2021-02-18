modules.component("mixDatabaseForm", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-form/view.html",
  bindings: {
    mixDatabaseId: "=",
    mixDatabaseName: "=",
    fields: "=?",
    attrDataId: "=?",
    attrData: "=?",
    parentType: "=?", // attribute set = 1 | post = 2 | page = 3 | module = 4
    parentId: "=?",
    defaultId: "=",
    backUrl: "=?",
    level: "=?",
    hideAction: "=?",
    saveData: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "RestMixDatabaseDataPortalService",
    "RestMixDatabaseColumnPortalService",
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
        ctrl.level = ctrl.level || 0;
        ctrl.loadData();
      };
      ctrl.loadData = async function () {
        /*
            If input is data id => load ctrl.attrData from service and handle it independently
        */
        ctrl.isBusy = true;

        if (ctrl.attrDataId) {
          var getData = await service.getSingle([ctrl.attrDataId]);
          ctrl.attrData = getData.data;
          if (ctrl.attrData) {
            ctrl.attrData.parentId = ctrl.parentId;
            ctrl.attrData.parentType = ctrl.parentType;
            ctrl.mixDatabaseId = ctrl.attrData.mixDatabaseId;
            ctrl.mixDatabaseName = ctrl.attrData.mixDatabaseName;
            ctrl.mixDatabaseTitle = $routeParams.mixDatabaseTitle;
            ctrl.backUrl = `/portal/mix-database-data/list?mixDatabaseId=${ctrl.attrData.mixDatabaseId}&mixDatabaseName=${ctrl.attrData.mixDatabaseName}&mixDatabaseTitle=test`;
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
        if ((ctrl.mixDatabaseName || ctrl.mixDatabaseId) && !ctrl.defaultData) {
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
                ctrl.backUrl = `/portal/${ctrl.parentType.toLowerCase()}/details/${
                  ctrl.parentId
                }`;
                break;

              default:
                ctrl.backUrl = `/portal/mix-database-data/details?dataId=${ctrl.parentId}&mixDatabaseId=${ctrl.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${$routeParams.mixDatabaseTitle}`;
                break;
            }
          }
        }
        var getDefault = await service.initData(
          ctrl.mixDatabaseName || ctrl.mixDatabaseId
        );
        ctrl.defaultData = getDefault.data;
        if (ctrl.defaultData) {
          ctrl.defaultData.mixDatabaseId = ctrl.mixDatabaseId || 0;
          ctrl.defaultData.mixDatabaseName = ctrl.mixDatabaseName;
          ctrl.defaultData.parentId = ctrl.parentId;
          ctrl.defaultData.parentType = ctrl.parentType;

          ctrl.fields = ctrl.fields || ctrl.defaultData.fields;
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
          ctrl.attrData.mixDatabaseId = ctrl.mixDatabaseId;
          ctrl.attrData.mixDatabaseName = ctrl.mixDatabaseName;
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
              // ctrl.attrData = await service.getSingle('portal', [ctrl.defaultId, ctrl.mixDatabaseId, ctrl.mixDatabaseName]);
              $scope.$apply();
            }
          } else {
            ctrl.isBusy = true;

            var saveResult = await service.save(ctrl.attrData);
            if (saveResult.isSucceed) {
              ctrl.attrData.id = saveResult.data.id;
              ctrl.isBusy = false;
              $rootScope.showMessage("success");
              if ($location.path() == "/portal/mix-database-data/create") {
                const url =
                  ctrl.backUrl ||
                  `/portal/mix-database-data/details?dataId=${ctrl.attrData.id}&mixDatabaseId=${ctrl.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${$routeParams.mixDatabaseTitle}`;
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
      ctrl.showContentFilter = function ($event) {
        $rootScope.showContentFilter(ctrl.loadSelectedLink);
      };
      ctrl.loadSelectedLink = function (data, type) {
        if (data) {
          ctrl.attrData.obj.target_id = data.id;
          ctrl.attrData.obj.title = data.title;
          ctrl.attrData.obj.type = type;
          ctrl.attrData.obj.uri = data.detailsUrl;
        }
      };
      ctrl.filterData = function (attributeName) {
        if (ctrl.attrData) {
          var attr = $rootScope.findObjectByKey(
            ctrl.attrData.obj,
            "mixDatabaseColumnName",
            attributeName
          );
          if (!attr) {
            attr = angular.copy(
              $rootScope.findObjectByKey(
                ctrl.defaultData.data,
                "mixDatabaseColumnName",
                attributeName
              )
            );
            mixDatabaseColumn;
            ctrl.attrData.obj.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
