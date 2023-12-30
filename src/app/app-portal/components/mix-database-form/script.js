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
    "$location",
    "RestMixAssociationPortalService",
    "RestMixDatabasePortalService",
    "MixDbService",
    "AuthService",
    function (
      $rootScope,
      $scope,
      $routeParams,
      $location,
      associationService,
      databaseService,
      service,
      authService
    ) {
      var ctrl = this;
      BaseHub.call(this, ctrl);
      $scope.host = `${$rootScope.globalSettings.domain}/${ctrl.host}`;
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
        ctrl.connectHub();
        ctrl.isBusy = false;
        $scope.$apply();
      };
      ctrl.connectHub = () => {
        ctrl.startConnection(
          "mixDbCommandHub",
          authService.authentication.accessToken,
          (err) => {
            if (
              authService.authentication.refreshToken &&
              err.message.indexOf("401") >= 0
            ) {
              authService.refreshToken().then(async () => {
                $scope.startConnection(
                  "mixDbCommandHub",
                  authService.authentication.accessToken
                );
              });
            }
          }
        );
      };
      ctrl.hubCreateData = function () {
        let msg = {
          connectionId: ctrl.hubRequest.from.connectionId,
          mixDbName: ctrl.mixDatabaseName,
          requestedBy: "",
          body: ctrl.mixDataContent,
        };
        if (!ctrl.mixDataContent.id) {
          ctrl.connection.invoke("CreateData", JSON.stringify(msg));
        } else {
          ctrl.connection.invoke("UpdateData", JSON.stringify(msg));
        }
        $rootScope.showMessage("Request Sent", "success");
      };
      ctrl.receiveMessage = function (msg) {
        switch (msg.action) {
          case "MyConnection":
            ctrl.hubRequest.from = msg.data;
            break;
          case "NewMessage":
            if (msg.type == "Success") {
              $rootScope.showMessage(msg.title, "success");
              ctrl.back();
            }
            if (msg.type == "Error") {
              $rootScope.showErrors([msg.title]);
            }
            break;
        }
      };
      ctrl.back = function () {
        if (ctrl.backUrl) {
          $location.url(ctrl.backUrl);
        } else {
          window.history.back();
        }
      };
      ctrl.translate = (keyword) => {
        return $rootScope.translate(keyword);
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
        if ($routeParams.parentId) {
          ctrl.mixDataContent.parentId = $routeParams.parentId;
          ctrl.mixDataContent.parentDatabaseName = $routeParams.parentName;
          ctrl.mixDataContent.childDatabaseName = ctrl.mixDatabaseName;
        }
        // TODO: refactor db relationship
        // if ($routeParams.parentId && $routeParams.parentName) {
        //   var getAssociation = await associationService.getAssociation(
        //     $routeParams.parentName,
        //     ctrl.mixDatabaseName,
        //     $routeParams.parentId,
        //     ctrl.mixDataContent.id
        //   );
        //   if (getAssociation.success) {
        //     ctrl.association = getAssociation.data;
        //   } else {
        //     ctrl.association = {
        //       parentId: $routeParams.parentId,
        //       parentDatabaseName: $routeParams.parentName,
        //       childDatabaseName: ctrl.mixDatabaseName,
        //     };
        //   }
        //   var parentIdNameFieldName = `${$routeParams.parentName
        //     .charAt(0)
        //     .toLowerCase()}${
        //     $routeParams.parentName.slice(1) || $routeParams.parentName
        //   }Id`;
        //   if (!ctrl.mixDataContent[parentIdNameFieldName]) {
        //     ctrl.mixDataContent[parentIdNameFieldName] = $routeParams.parentId;
        //   }
        // }
      };

      ctrl.reload = async function () {
        ctrl.mixDataContent = angular.copy(ctrl.defaultData);
      };
      ctrl.loadSelected = function () {
        if (ctrl.selectedList.data.length) {
          ctrl.mixDataContent = ctrl.selectedList.data[0];
          ctrl.mixDataContent.mixDatabaseId = ctrl.mixDatabaseId;
          ctrl.mixDataContent.mixDatabaseName = ctrl.mixDatabaseName;
          if (ctrl.parentId) {
            ctrl.mixDataContent.parentId = ctrl.parentId;
          }
          if (ctrl.guidParentId) {
            ctrl.mixDataContent.parentId = ctrl.guidParentId;
          }
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
