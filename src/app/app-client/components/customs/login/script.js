modules.component("tclLogin", {
  binding: {
    user: "=",
  },
  templateUrl: "/mix-app/views/app-client/components/customs/login/view.html",
  controller: [
    "$scope",
    "$rootScope",
    "RestMixDatabaseDataClientService",
    function ($scope, $rootScope, service) {
      var ctrl = this;
      ctrl.loginData = {
        username: "",
        password: "",
        pageSize: 1,
        pageIndex: 0,
        mixDatabaseName: "tcl_user",
        filterType: "equal",
      };
      ctrl.$onInit = async function () {};
      ctrl.isBusy = false;
      ctrl.translate = $rootScope.translate;
      ctrl.submit = async function () {
        $rootScope.isBusy = true;
        var result = await service.getList(ctrl.loginData);
        if (result.isSucceed) {
          if (result.data.totalItems > 0) {
            if (
              result.data.items[0].obj.password == ctrl.loginData.password &&
              result.data.items[0].obj.username == ctrl.loginData.username
            ) {
              ctrl.onSuccess(result);
            } else {
              ctrl.onFail(result);
            }
          } else {
            ctrl.onFail(result);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          ctrl.onFail(result);
          ctrl.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.onSuccess = function (result) {
        $rootScope.isLogin = true;
        ctrl.user = result.data.items[0];
        $rootScope.user = result.data.items[0];
        $scope.$apply();
      };

      ctrl.onFail = function (result) {
        ctrl.msg = {
          color: "red",
          text: "Sai tên đăng nhập hoặc mật khẩu!",
        };
      };
    },
  ],
});
