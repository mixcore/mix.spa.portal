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
    $scope.init = async function (formName, parentId, parentType, successMsg) {
      $scope.successMsg = successMsg;
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
      var save = await dataService.save(data);
      if (save.isSucceed) {
        $rootScope.showMessage("Thông báo", $scope.successMsg || "Thành công");
        $scope.formData = angular.copy($scope.defaultData);
        $rootScope.isBusy = false;
        $scope.loadData();
        $scope.$apply();
      } else {
        if (save.errors && save.errors.length) {
          let errMsg = "Vui lòng thực hiện lại";
          if (save.errors[0].indexOf("is existed")) {
            errMsg = save.errors[0]
              .toString()
              .replace("is existed", "đã tồn tại");
          }
          window.showMessage("Lỗi", errMsg);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
