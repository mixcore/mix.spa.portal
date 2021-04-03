modules.component("modalNavs", {
  templateUrl: "/mix-app/views/app-portal/components/modal-navs/view.html",
  bindings: {
    modelName: "=",
    viewType: "=",
    selects: "=",
    isSingle: "=?",
    isGlobal: "=?",
    save: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    "ngAppSettings",
    function ($rootScope, $scope, $routeParams, ngAppSettings) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.contentStatuses = angular.copy(ngAppSettings.contentStatuses);
      ctrl.viewmodel = null;
      ctrl.data = null;
      ctrl.isInit = false;
      ctrl.isValid = true;
      ctrl.errors = [];
      ctrl.selected = [];

      ctrl.init = function () {
        ctrl.service = $rootScope.getRestService(
          ctrl.modelName + "/portal",
          ctrl.isGlobal
        );
        ctrl.prefix = "modal_navs_" + ctrl.modelName;
        ctrl.cols = ctrl.selects.split(",");
        ctrl.getList();
      };

      ctrl.getList = async function (pageIndex) {
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var d = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = d.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var d = new Date(ctrl.request.toDate);
          ctrl.request.toDate = d.toISOString();
        }
        var resp = await ctrl.service.getList(ctrl.request);
        if (resp.isSucceed) {
          ctrl.data = resp.data;
          $.each(ctrl.data.items, function (i, data) {
            $.each(ctrl.viewmodels, function (i, e) {
              if (e.dataId === data.id) {
                data.isHidden = true;
              }
            });
          });
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      // ctrl.loadData = async function (pageIndex) {
      //     ctrl.request.query = ctrl.query + ctrl.srcId;
      //     if (pageIndex !== undefined) {
      //         ctrl.request.pageIndex = pageIndex;
      //     }
      //     if (ctrl.request.fromDate !== null) {
      //         var d = new Date(ctrl.request.fromDate);
      //         ctrl.request.fromDate = d.toISOString();
      //     }
      //     if (ctrl.request.toDate !== null) {
      //         var d = new Date(ctrl.request.toDate);
      //         ctrl.request.toDate = d.toISOString();
      //     }
      //     var response = await pageService.getList(ctrl.request);
      //     if (response.isSucceed) {
      //         ctrl.data = response.data;
      //         ctrl.navs = [];
      //         angular.forEach(response.data.items, function (e) {
      //             var item = {
      //                 priority: e.priority,
      //                 description: e.title,
      //                 pageId: e.id,
      //                 image: e.thumbnailUrl,
      //                 specificulture: e.specificulture,
      //                 status: 'Published',
      //                 isActived: false
      //             };
      //             item[ctrl.srcField] = ctrl.srcId;
      //             ctrl.navs.push(item);
      //         });
      //         $rootScope.isBusy = false;
      //         $scope.$apply();
      //     }
      //     else {
      //         $rootScope.showErrors(response.errors);
      //         $rootScope.isBusy = false;
      //         $scope.$apply();
      //     }
      // }
      ctrl.selectAll = function (isSelectAll) {
        angular.forEach(ctrl.data.items, (element) => {
          element.isActived = isSelectAll;
        });
      };
      ctrl.selectChange = function (item) {
        if (ctrl.isSingle == "true" && item.isActived) {
          angular.forEach(ctrl.data.items, (element) => {
            element.isActived = false;
          });
          item.isActived = true;
        }
      };
      ctrl.saveSelected = function () {
        ctrl.selected = $rootScope.filterArray(
          ctrl.data.items,
          ["isActived"],
          [true]
        );
        if (ctrl.save) {
          ctrl.save({ selected: ctrl.selected });
        }
      };
    },
  ],
});
