app.controller("MixDatabaseFormController", [
  "$rootScope",
  "$scope",
  "ngAppSettings",
  "RestRelatedAttributeDataPortalService",
  "RestMixDatabaseDataPortalService",
  function($rootScope, $scope, ngAppSettings, navService, dataService) {
    $scope.defaultData = null;
    $scope.formData = null;
    $scope.formRecords = null;
    $scope.formName = null;
    $scope.navRequest = angular.copy(ngAppSettings.request);
    $scope.successMsg = "Thành công";
    $scope.init =
        async function(formName, parentId, parentType, validateHandler,
                       loadingHandler, successHandler, failHandler) {
      $scope.successMsg = "Thành công";
      $scope.validateHandler = validateHandler;
      $scope.loadingHandler = loadingHandler;
      $scope.successHandler = successHandler;
      $scope.failHandler = failHandler;
      $scope.formName = formName;
      $scope.navRequest.mixDatabaseName = formName;
      $scope.navRequest.parentType = parentType;
      $scope.navRequest.parentId = parentId;
      dataService.init("mix-database-data/portal");
      var getDefault = await dataService.initData($scope.formName);
      $scope.defaultData = getDefault.data;
      if ($scope.defaultData) {
        $scope.defaultData.mixDatabaseName = $scope.formName;
        $scope.defaultData.parentType = parentType || "Set";
        $scope.defaultData.parentId = parentId;
        $scope.formData = angular.copy($scope.defaultData);
      }

      $scope.$apply();
    };
    $scope.loadData = function() {
      navService.getList($scope.navRequest).then((resp) => {
        if (resp) {
          $scope.formRecords = resp.data;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors("Failed");
          }
          $scope.$apply();
        }
      });
    };
    $scope.submit = async (data) => {
      $rootScope.isBusy = true;
      if ($scope.loadingHandler) {
        $rootScope.executeFunctionByName($scope.loadingHandler, [ true ]);
      }
      if (!$scope.validateHandler ||
          $rootScope.executeFunctionByName($scope.validateHandler, [ data ])) {
        var saveResult = await dataService.save(data);
        if (saveResult.isSucceed) {
          if ($scope.successHandler) {
            $rootScope.executeFunctionByName($scope.successHandler, [
              saveResult,
            ]);
          } else {
            alert($scope.successMsg);
          }
          $scope.formData = angular.copy($scope.defaultData);
          $rootScope.isBusy = false;
          $scope.loadData();
          if ($scope.loadingHandler) {
            $rootScope.executeFunctionByName($scope.loadingHandler, [ false ]);
          }
          $scope.$apply();
        } else {
          if (saveResult.errors && saveResult.errors.length) {
            if ($scope.failHandler) {
              $rootScope.executeFunctionByName($scope.failHandler, [
                data,
                saveResult,
              ]);
            } else {
              alert(errMsg);
            }
          }
          if ($scope.loadingHandler) {
            $rootScope.executeFunctionByName($scope.loadingHandler, [ false ]);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };
  },
]);
