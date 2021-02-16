modules.component("haiyenSubscriber", {
  binding: {},
  templateUrl:
    "/mix-app/views/app-client/components/customs/subscriber/view.html",
  controller: [
    "$scope",
    "$rootScope",
    "RestMixDatabaseDataClientService",
    function ($scope, $rootScope, service) {
      var ctrl = this;
      ctrl.subscriber = null;
      ctrl.formName = "subscribers";
      ctrl.$onInit = async function () {
        var initData = await service.initData(ctrl.formName);
        if (initData.isSucceed) {
          ctrl.default = initData.data;
          ctrl.subscriber = angular.copy(ctrl.default);
          $scope.$apply();
        }
      };
      ctrl.isBusy = false;
      ctrl.submit = async function () {
        ctrl.isBusy = true;
        var result = await service.save(ctrl.subscriber);
        if (result.isSucceed) {
          ctrl.onSuccess(result);
          ctrl.subscriber = angular.copy(ctrl.default);
          ctrl.isBusy = false;
        } else {
          ctrl.onFail(result);
          ctrl.isBusy = false;
        }
        $scope.$apply();
      };
      ctrl.onSuccess = function (result) {
        ctrl.msg = {
          color: "green",
          text: "Cám ơn bạn đã đăng ký thành công!",
        };
      };

      ctrl.onFail = function (result) {
        ctrl.msg = {
          color: "red",
          text: result.errors[0],
        };
      };
    },
  ],
});
