modules.component("mixDatabaseForm", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-form/view.html",
  bindings: {
    mixDatabaseId: "=",
    mixDatabaseName: "=",
    mixDatabaseTitle: "=?",
    columns: "=?",
    mixDatabaseDataId: "=?",
    mixDatabaseData: "=",
    parentType: "=?", // attribute set = 1 | post = 2 | page = 3 | module = 4
    intParentId: "=?",
    guidParentId: "=?",
    defaultId: "=",
    backUrl: "=?",
    level: "=?",
    hideAction: "=?",
    saveSuccess: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, $location, $routeParams, service) {
      var ctrl = this;
      ctrl.isBusy = false;
      ctrl.attributes = [];
      ctrl.isInRole = $rootScope.isInRole;
      ctrl.defaultData = null;
      ctrl.selectedProp = null;
      ctrl.mixConfigurations = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        ctrl.level = ctrl.level || 0;
        await ctrl.loadData();
      };
      ctrl.loadData = async function () {
        /*
            If input is data id => load ctrl.mixDatabaseData from service and handle it independently
        */
        ctrl.isBusy = true;
        if (ctrl.mixDatabaseDataId) {
          var getData = await service.getSingle([ctrl.mixDatabaseDataId]);
          ctrl.mixDatabaseData = getData.data;
          if (ctrl.mixDatabaseData) {
            ctrl.mixDatabaseData.intParentId = ctrl.intParentId;
            ctrl.mixDatabaseData.guidParentId = ctrl.guidParentId;
            ctrl.mixDatabaseData.parentType = ctrl.parentType;
            ctrl.mixDatabaseId = ctrl.mixDatabaseData.mixDatabaseId;
            ctrl.mixDatabaseName = ctrl.mixDatabaseData.mixDatabaseName;
            ctrl.mixDatabaseTitle =
              ctrl.mixDatabaseTitle ||
              $routeParams.mixDatabaseTitle ||
              ctrl.mixDatabaseName;
            ctrl.backUrl =
              ctrl.backUrl ??
              `/portal/mix-database-data/list?mixDatabaseId=${ctrl.mixDatabaseData.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseData.mixDatabaseName}&mixDatabaseTitle=${ctrl.mixDatabaseTitle}`;
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
          !ctrl.mixDatabaseData &&
          (ctrl.mixDatabaseName || ctrl.mixDatabaseId) &&
          !ctrl.defaultData
        ) {
          await ctrl.loadDefaultModel();
          ctrl.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.loadDefaultModel = async function () {
        if ($routeParams.intParentId) {
          ctrl.intParentId = $routeParams.intParentId;
        }
        if ($routeParams.guidParentId) {
          ctrl.guidParentId = $routeParams.guidParentId;
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
                ctrl.backUrl =
                  ctrl.backUrl ??
                  `/portal/${ctrl.parentType.toLowerCase()}/details/${
                    ctrl.intParentId
                  }`;
                break;

              default:
                ctrl.backUrl =
                  ctrl.backUrl ??
                  `/portal/mix-database-data/details?dataId=${ctrl.guidParentId}&mixDatabaseId=${ctrl.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${$routeParams.mixDatabaseTitle}`;
                break;
            }
          }
        }
        var getDefault = await service.initData(
          ctrl.mixDatabaseName || ctrl.mixDatabaseId
        );
        ctrl.defaultData = getDefault.data;
        if (ctrl.defaultData) {
          ctrl.defaultData.id = null;
          ctrl.defaultData.intParentId = ctrl.intParentId;
          ctrl.defaultData.guidParentId = ctrl.guidParentId;
          ctrl.defaultData.parentType = ctrl.parentType;
          if (ctrl.columns) {
            let otherColumns = ctrl.defaultData.columns.filter(
              (m) =>
                ctrl.columns.filter((n) => n.systemName == m.systemName)
                  .length == 0
            );
            ctrl.columns = ctrl.columns.concat(otherColumns);
          } else {
            ctrl.columns = ctrl.defaultData.columns;
          }
        }

        if (!ctrl.mixDatabaseData) {
          ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
        }
      };

      ctrl.reload = async function () {
        ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
      };
      ctrl.loadSelected = function () {
        if (ctrl.selectedList.data.length) {
          ctrl.mixDatabaseData = ctrl.selectedList.data[0];
          ctrl.mixDatabaseData.mixDatabaseId = ctrl.mixDatabaseId;
          ctrl.mixDatabaseData.mixDatabaseName = ctrl.mixDatabaseName;
          ctrl.mixDatabaseData.intParentId = ctrl.intParentId;
          ctrl.mixDatabaseData.guidParentId = ctrl.guidParentId;
          ctrl.mixDatabaseData.parentType = ctrl.parentType;
        }
      };
      ctrl.submit = async function () {
        if (ctrl.validate()) {
          ctrl.isBusy = true;

          var saveResult = await service.save(ctrl.mixDatabaseData);
          if (saveResult.success) {
            ctrl.mixDatabaseData = saveResult.data;
            if (ctrl.saveSuccess) {
              ctrl.saveSuccess({ data: ctrl.mixDatabaseData });
            }
            ctrl.isBusy = false;
            $rootScope.showMessage("success");
            $scope.$apply();
          } else {
            ctrl.isBusy = false;
            if (saveResult) {
              $rootScope.showErrors(saveResult.errors);
            }
            $scope.$apply();
          }
        }
      };
      ctrl.validate = function () {
        var isValid = true;
        ctrl.errors = [];
        angular.forEach(ctrl.columns, function (column) {
          if (column.regex) {
            var regex = RegExp(column.regex, "g");
            isValid = regex.test(ctrl.mixDatabaseData.data[column.name]);
            if (!isValid) {
              ctrl.errors.push(`${column.name} is not match Regex`);
            }
          }
          if (!isValid) {
            $rootScope.showErrors(ctrl.errors);
          }
          if (isValid && column.isEncrypt) {
            ctrl.mixDatabaseData.data[column.name] = $rootScope.encrypt(
              ctrl.mixDatabaseData.data[column.name]
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
          ctrl.mixDatabaseData.data.target_id = data.id;
          ctrl.mixDatabaseData.data.title = data.title;
          ctrl.mixDatabaseData.data.type = type;
          ctrl.mixDatabaseData.data.uri = data.detailUrl;
        }
      };
      ctrl.filterData = function (attributeName) {
        if (ctrl.mixDatabaseData) {
          var attr = $rootScope.findObjectByKey(
            ctrl.mixDatabaseData.data,
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
            ctrl.mixDatabaseData.data.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
