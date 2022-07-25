modules.component("mixDatabaseForm", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-form/view.html",
  bindings: {
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    mixDatabaseTitle: "=?",
    columns: "=?",
    mixDataContentId: "=?",
    mixDataContent: "=?",
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
    "MixDbService",
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
        service.initDbName(ctrl.mixDatabaseName);
        await ctrl.loadData();
      };
      ctrl.loadData = async function () {
        /*
            If input is data id => load ctrl.mixDataContent from service and handle it independently
        */
        ctrl.isBusy = true;
        if (ctrl.mixDataContentId) {
          var getData = await service.getSingle([ctrl.mixDataContentId]);
          ctrl.mixDataContent = getData.data;
          if (ctrl.mixDataContent) {
            ctrl.mixDataContent.intParentId = ctrl.intParentId;
            ctrl.mixDataContent.guidParentId = ctrl.guidParentId;
            ctrl.mixDataContent.parentType = ctrl.parentType;
            ctrl.mixDatabaseId = ctrl.mixDataContent.mixDatabaseId;
            ctrl.mixDatabaseName = ctrl.mixDataContent.mixDatabaseName;
            ctrl.mixDatabaseTitle =
              ctrl.mixDatabaseTitle ||
              $routeParams.mixDatabaseTitle ||
              ctrl.mixDatabaseName;
            ctrl.backUrl =
              ctrl.backUrl ??
              `/admin/mix-database-data/list?mixDatabaseId=${ctrl.mixDataContent.mixDatabaseId}&mixDatabaseName=${ctrl.mixDataContent.mixDatabaseName}&mixDatabaseTitle=${ctrl.mixDatabaseTitle}`;
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
          !ctrl.mixDataContent &&
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
                  `/admin/${ctrl.parentType.toLowerCase()}/details/${
                    ctrl.intParentId
                  }`;
                break;

              default:
                ctrl.backUrl =
                  ctrl.backUrl ??
                  `/admin/mix-database-data/details?dataId=${ctrl.guidParentId}&mixDatabaseId=${ctrl.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${$routeParams.mixDatabaseTitle}`;
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

        if (!ctrl.mixDataContent) {
          ctrl.mixDataContent = angular.copy(ctrl.defaultData);
        }
      };

      ctrl.reload = async function () {
        ctrl.mixDataContent = angular.copy(ctrl.defaultData);
      };
      ctrl.loadSelected = function () {
        if (ctrl.selectedList.data.length) {
          ctrl.mixDataContent = ctrl.selectedList.data[0];
          ctrl.mixDataContent.mixDatabaseId = ctrl.mixDatabaseId;
          ctrl.mixDataContent.mixDatabaseName = ctrl.mixDatabaseName;
          ctrl.mixDataContent.intParentId = ctrl.intParentId;
          ctrl.mixDataContent.guidParentId = ctrl.guidParentId;
          ctrl.mixDataContent.parentType = ctrl.parentType;
        }
      };
      ctrl.submit = async function () {
        if (ctrl.validate()) {
          ctrl.isBusy = true;

          var saveResult = await service.save(ctrl.mixDataContent);
          if (saveResult.success) {
            ctrl.mixDataContent = saveResult.data;
            if (ctrl.saveSuccess) {
              ctrl.saveSuccess({ data: ctrl.mixDataContent });
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
            isValid = regex.test(ctrl.mixDataContent.data[column.name]);
            if (!isValid) {
              ctrl.errors.push(`${column.name} is not match Regex`);
            }
          }
          if (!isValid) {
            $rootScope.showErrors(ctrl.errors);
          }
          if (isValid && column.isEncrypt) {
            ctrl.mixDataContent.data[column.name] = $rootScope.encrypt(
              ctrl.mixDataContent.data[column.name]
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
          ctrl.mixDataContent.data.target_id = data.id;
          ctrl.mixDataContent.data.title = data.title;
          ctrl.mixDataContent.data.type = type;
          ctrl.mixDataContent.data.uri = data.detailUrl;
        }
      };
      ctrl.filterData = function (attributeName) {
        if (ctrl.mixDataContent) {
          var attr = $rootScope.findObjectByKey(
            ctrl.mixDataContent.data,
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
            ctrl.mixDataContent.data.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
