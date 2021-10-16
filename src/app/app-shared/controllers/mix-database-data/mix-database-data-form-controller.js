appShared.controller("MixDataController", [
  "$rootScope",
  "$scope",
  "ngAppSettings",
  "RestRelatedAttributeDataFormService",
  "RestMixDatabaseDataClientService",
  function ($rootScope, $scope, ngAppSettings, navService, dataService) {
    $scope.defaultData = null;
    $scope.formData = null;
    $scope.formRecords = null;
    $scope.formName = null;
    $scope.navRequest = angular.copy(ngAppSettings.request);
    $scope.successMsg = "Thành công";
    $scope.init = async function (
      formName,
      parentId,
      parentType,
      validateHandler,
      loadingHandler,
      successHandler,
      failHandler
    ) {
      $scope.successMsg = "Success";
      $scope.validateHandler = validateHandler;
      $scope.loadingHandler = loadingHandler;
      $scope.successHandler = successHandler;
      $scope.failHandler = failHandler;
      $scope.formName = formName;
      $scope.navRequest.mixDatabaseName = formName;
      $scope.navRequest.parentType = parentType;
      $scope.navRequest.parentId = parentId;
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
    $scope.loadData = function () {
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
      $scope.form.$$element.addClass("was-validated");
      if ($scope.form.$valid) {
        $rootScope.isBusy = true;
        if ($scope.loadingHandler) {
          $rootScope.executeFunctionByName($scope.loadingHandler, [true]);
        }
        if (
          !$scope.validateHandler ||
          $rootScope.executeFunctionByName($scope.validateHandler, [data])
        ) {
          var saveResult = await dataService.save(data);
          if (saveResult.isSucceed) {
            $scope.loadData();
            if ($scope.successHandler) {
              $rootScope.executeFunctionByName($scope.successHandler, [
                saveResult,
              ]);
            } else {
              $scope.form.$$element.removeClass("was-validated");
              $scope.form.$setPristine();
              $scope.form.$setUntouched();
              console.log($scope.successMsg);
            }
            $scope.formData = angular.copy($scope.defaultData);
            $rootScope.isBusy = false;
            // $scope.loadData();
            if ($scope.loadingHandler) {
              $rootScope.executeFunctionByName($scope.loadingHandler, [false]);
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
                console.error(saveResult.errors);
              }
            }
            if ($scope.loadingHandler) {
              $rootScope.executeFunctionByName($scope.loadingHandler, [false]);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
      }
    };

    $scope.saveValue = async (id, name, value) => {
      if ($scope.form.$valid) {
        $rootScope.isBusy = true;
        var obj = new {}();
        obj[name] = value;
        await dataService.saveValues(id, obj);
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
