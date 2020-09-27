app.controller("AttributeSetFormController", [
  "$rootScope",
  "$scope",
  "ngAppSettings",
  "RestRelatedAttributeDataPortalService",
  "RestAttributeSetDataPortalService",
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
      successHandler,
      failHandler
    ) {
      $scope.successMsg = "Thành công";
      $scope.successHandler = successHandler;
      $scope.failHandler = failHandler;
      $scope.formName = formName;
      $scope.navRequest.attributeSetName = formName;
      $scope.navRequest.parentType = parentType;
      $scope.navRequest.parentId = parentId;
      dataService.init("attribute-set-data/portal");
      var getDefault = await dataService.initData($scope.formName);
      $scope.defaultData = getDefault.data;
      if ($scope.defaultData) {
        $scope.defaultData.attributeSetName = $scope.formName;
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
      $rootScope.isBusy = true;
      var saveResult = await dataService.save(data);
      if (saveResult.isSucceed) {
        if ($scope.successHandler) {
          $rootScope.executeFunctionByName($scope.successHandler, [saveResult]);
        } else {
          alert($scope.successMsg);
        }
        $scope.formData = angular.copy($scope.defaultData);
        $rootScope.isBusy = false;
        $scope.loadData();
        $scope.$apply();
      } else {
        if (saveResult.errors && saveResult.errors.length) {
          let errMsg = "Vui lòng thực hiện lại";
          if (saveResult.errors[0].indexOf("is existed")) {
            errMsg = saveResult.errors[0]
              .toString()
              .replace("is existed", "đã tồn tại");
          }
          if ($scope.successHandler) {
            $rootScope.executeFunctionByName($scope.failHandler, [saveResult]);
          } else {
            alert(errMsg);
          }
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
