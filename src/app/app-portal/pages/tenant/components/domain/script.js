app.component("tenantDomain", {
  templateUrl:
    "/mix-app/views/app-portal/pages/tenant/components/domain/view.html",
  bindings: {
    model: "=",
    isAdmin: "=?",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    function ($rootScope, $scope, ngAppSettings) {
      var ctrl = this;
      var service;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.request.columns = [
        "id",
        "host",
        "displayName",
        "createdDateTime",
        "createdBy",
      ];
      ctrl.$onInit = async function () {
        service = $rootScope.getRestService("mix-domain");
        await ctrl.getList();
      };
      ctrl.getList = async function (pageIndex, params = []) {
        $rootScope.isBusy = true;
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var d = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = d.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var dt = new Date(ctrl.request.toDate);
          ctrl.request.toDate = dt.toISOString();
        }
        var resp = await service.getList(ctrl.request, params);
        if (resp && resp.success) {
          ctrl.data = resp.data;
          $.each(ctrl.data, function (i, data) {
            $.each(ctrl.viewmodels, function (i, e) {
              if (e.dataId === data.id) {
                data.isHidden = true;
              }
            });
          });
          if (ctrl.getListSuccessCallback) {
            ctrl.getListSuccessCallback();
          }
          if (ctrl.isScrollTop) {
            $("html, body").animate({ scrollTop: "0px" }, 500);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors || ["Failed"]);
          }
          if (ctrl.getListFailCallback) {
            ctrl.getListFailCallback();
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
});
