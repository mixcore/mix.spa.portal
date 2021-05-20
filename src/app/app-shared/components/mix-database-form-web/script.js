sharedComponents.component("mixDatabaseFormWeb", {
  templateUrl:
    "/mix-app/views/app-shared/components/mix-database-form-web/view.html",
  bindings: {
    mixDatabaseId: "=",
    mixDatabaseName: "=",
    mixDatabaseDataId: "=?",
    mixDatabaseData: "=?",
    parentType: "=?",
    parentId: "=?",
    defaultId: "=",
    saveData: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabasePortalService",
    function ($rootScope, $scope, service) {
      var ctrl = this;
      ctrl.isBusy = false;
      ctrl.attributes = [];
      ctrl.defaultData = null;
      ctrl.selectedProp = null;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        ctrl.defaultData = await service.getSingle("web", [
          ctrl.defaultId,
          ctrl.mixDatabaseId,
          ctrl.mixDatabaseName,
        ]);
        ctrl.loadData();
      };
      ctrl.loadData = async function () {
        /*
                    If input is data id => load ctrl.mixDatabaseData from service and handle it independently
                    Else modify input ctrl.mixDatabaseData
                */
        $rootScope.isBusy = true;
        if (ctrl.mixDatabaseDataId) {
          ctrl.mixDatabaseData = await service.getSingle("portal", [
            ctrl.mixDatabaseDataId,
            ctrl.mixDatabaseId,
            ctrl.mixDatabaseName,
          ]);
          if (ctrl.mixDatabaseData) {
            ctrl.defaultData.mixDatabaseId = ctrl.mixDatabaseData.mixDatabaseId;
            ctrl.defaultData.mixDatabaseName =
              ctrl.mixDatabaseData.mixDatabaseName;
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (ctrl.mixDatabaseData) {
              $rootScope.showErrors("Failed");
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        } else {
          if (!ctrl.mixDatabaseData) {
            ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.reload = async function () {
        ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
      };
      ctrl.submit = async function () {
        angular.forEach(ctrl.mixDatabaseData.values, function (e) {
          //Encrypt column before send
          if (e.column.isEncrypt) {
            var encryptData = $rootScope.encrypt(e.stringValue);
            e.encryptKey = encryptData.key;
            e.encryptValue = encryptData.data;
            e.stringValue = null;
          }
        });
        if (ctrl.saveData) {
          ctrl.isBusy = true;
          var result = await ctrl.saveData({ data: ctrl.mixDatabaseData });
          if (result && result.isSucceed) {
            ctrl.isBusy = false;
            ctrl.mixDatabaseData = result.data;
            $scope.$apply();
          } else {
            ctrl.isBusy = false;
            // ctrl.mixDatabaseData = await service.getSingle('portal', [ctrl.defaultId, ctrl.mixDatabaseId, ctrl.mixDatabaseName]);
            $scope.$apply();
          }
        } else {
          ctrl.isBusy = true;
          var saveResult = await service.save(ctrl.mixDatabaseData);
          if (saveResult.isSucceed) {
            ctrl.isBusy = false;
          } else {
            ctrl.isBusy = false;
            if (saveResult) {
              $rootScope.showErrors(saveResult.errors);
            }
            $scope.$apply();
          }
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
            ctrl.mixDatabaseData.data.push(attr);
          }
          return attr;
        }
      };
    },
  ],
});
