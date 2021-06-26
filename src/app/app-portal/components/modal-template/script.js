modules.component("modalTemplate", {
  templateUrl: "/mix-app/views/app-portal/components/modal-template/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "TemplateService",
    function ($rootScope, $scope, ngAppSettings, service) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.$onInit = function () {
        ctrl.modal = $("#modal-template");
        ctrl.request.status = null;
        ctrl.request.pageSize = 10;
        ctrl.modal.on("shown.bs.modal", function () {
          ctrl.search();
        });
      };
      ctrl.search = async function (pageIndex) {
        if (ctrl.request.keyword.indexOf("/") > 0) {
          let params = ctrl.request.keyword.split("/");
          ctrl.request.folderType = params[0];
          ctrl.request.keyword = params[1];
        }
        ctrl.request.pageIndex = pageIndex || ctrl.request.pageIndex;
        $rootScope.isBusy = true;
        var resp = await service.getList(ctrl.request);
        if (resp && resp.isSucceed) {
          ctrl.data = resp.data;
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      };
      ctrl.edit = function (item) {
        let path = `/portal/template/details/${item.themeId}/${item.folderType}/${item.id}`;
        ctrl.modal.modal("hide");
        $rootScope.goToPath(path);
      };
    },
  ],
});
