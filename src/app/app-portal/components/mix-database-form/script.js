modules.component("mixDatabaseForm", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-form/view.html",
  bindings: {
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    mixDatabaseTitle: "=?",
    mixDatabaseType: "=?",
    parentId: "=?",
    parentType: "=?", // MixContentType
    parentName: "=?",
    postId: "=?",
    pageId: "=?",
    moduleId: "=?",
    columns: "=?",
    references: "=?",
    mixDataContentId: "=?",
    mixDataContent: "=?",
    intParentId: "=?",
    guidParentId: "=?",
    defaultId: "=",
    backUrl: "=?",
    level: "=?",
    hideAction: "=?",
    onSave: "&?",
    onSaveSuccess: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    "RestMixAssociationPortalService",
    "RestMixDatabasePortalService",
    "MixDbService",
    function (
      $rootScope,
      $scope,
      $routeParams,
      associationService,
      databaseService,
      service
    ) {
      var ctrl = this;
      ctrl.isBusy = false;
      ctrl.attributes = [];
      ctrl.isInRole = $rootScope.isInRole;
      ctrl.defaultData = null;
      ctrl.selectedProp = null;
      ctrl.mixConfigurations = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        ctrl.level = ctrl.level || 0;
        ctrl.canSave = ctrl.onSave != undefined;
        let getDatabase = await databaseService.getByName(ctrl.mixDatabaseName);
        ctrl.database = getDatabase.data;
        service.initDbName(ctrl.mixDatabaseName);
        await ctrl.loadData();
        ctrl.isBusy = false;
        $scope.$apply();
      };
      ctrl.loadData = async function () {
        /*
            If input is data id => load ctrl.mixDataContent from service and handle it independently
        */
        ctrl.isBusy = true;
        if (!ctrl.mixDataContent && ctrl.mixDataContentId) {
          service.initDbName(ctrl.mixDatabaseName);
          var getData = await service.getSingle([ctrl.mixDataContentId], {
            loadNestedData: true,
          });
          ctrl.mixDataContent = getData.data;
          if (ctrl.mixDataContent) {
            ctrl.mixDataContent.intParentId = ctrl.intParentId;
            ctrl.mixDataContent.guidParentId = ctrl.guidParentId;
            ctrl.mixDataContent.parentType = ctrl.parentType;
            // ctrl.mixDatabaseId = ctrl.mixDataContent.mixDatabaseId;
            // ctrl.mixDatabaseName = ctrl.mixDataContent.mixDatabaseName;
            ctrl.mixDatabaseTitle =
              ctrl.mixDatabaseTitle ||
              $routeParams.mixDatabaseTitle ||
              ctrl.mixDatabaseName;
            ctrl.backUrl =
              ctrl.backUrl ??
              `/admin/mix-database-data/list?mixDatabaseId=${ctrl.mixDataContent.mixDatabaseId}&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${ctrl.mixDatabaseTitle}`;
            // await ctrl.loadDefaultModel();
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
          ctrl.mixDataContent = {};
          if (ctrl.parentId) {
            ctrl.mixDataContent.parentId = ctrl.parentId;
          }
          //   await ctrl.loadDefaultModel();
          ctrl.isBusy = false;
        }
        if ($routeParams.parentId && $routeParams.parentName) {
          ctrl.association = {
            parentId: $routeParams.parentId,
            parentDatabaseName: $routeParams.parentName,
            childDatabaseName: ctrl.mixDatabaseName,
          };
          var parentIdNameFieldName = `${$routeParams.parentName
            .charAt(0)
            .toLowerCase()}${
            $routeParams.parentName.slice(1) || $routeParams.parentName
          }Id`;
          if (!ctrl.mixDataContent[parentIdNameFieldName]) {
            ctrl.mixDataContent[parentIdNameFieldName] = $routeParams.parentId;
          }
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
          if (ctrl.onSave) {
            ctrl.onSave({ data: ctrl.mixDataContent });
          } else {
            ctrl.isBusy = true;
            service.initDbName(ctrl.mixDatabaseName);
            var saveResult = await service.save(ctrl.mixDataContent);
            if (saveResult.success) {
              ctrl.mixDataContent = saveResult.data;
              if (ctrl.association) {
                let result = await ctrl.saveAssociation(ctrl.mixDataContent);
                if (result.success) {
                  ctrl.isBusy = false;
                  $rootScope.showMessage("success");
                  $scope.$apply();
                } else {
                  ctrl.isBusy = false;
                  $rootScope.showErrors(result.errors);
                  $scope.$apply();
                }
              } else {
                if (ctrl.onSaveSuccess) {
                  ctrl.onSaveSuccess({ data: ctrl.mixDataContent });
                }
                ctrl.isBusy = false;
                $rootScope.showMessage("success");
                $scope.$apply();
              }
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
      ctrl.saveAssociation = async function (data) {
        ctrl.association.childId = data.id;
        return await associationService.save(ctrl.association);
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
