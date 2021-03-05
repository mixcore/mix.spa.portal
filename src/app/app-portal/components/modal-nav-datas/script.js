modules.component("modalNavDatas", {
  templateUrl: "/mix-app/views/app-portal/components/modal-nav-datas/view.html",
  bindings: {
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    parentId: "=?",
    parentType: "=?",
    type: "=?",
    columnDisplay: "=?",
    selectedList: "=?",
    selectCallback: "&",
    save: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestMixDatabaseDataPortalService",
    "RestRelatedMixDatabasePortalService",
    function ($rootScope, $scope, ngAppSettings, service, navService) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.request.key = "readData";
      ctrl.navs = [];

      ctrl.queries = {};
      ctrl.data = { items: [] };
      ctrl.$onInit = function () {
        if (!ctrl.selectedList) {
          ctrl.selectedList = [];
        }
        if (ctrl.mixDatabaseId) {
          ctrl.request.query = "mixDatabaseId=" + ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.query += "&mixDatabaseName=" + ctrl.mixDatabaseName;
        }
      };
      ctrl.loadData = async function (pageIndex) {
        ctrl.request.query = "";
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
        if (ctrl.mixDatabaseId) {
          ctrl.request.query = "mixDatabaseId=" + ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.query += "&mixDatabaseName=" + ctrl.mixDatabaseName;
        }
        Object.keys(ctrl.queries).forEach((e) => {
          if (ctrl.queries[e]) {
            ctrl.request.query += "&" + e + "=" + ctrl.queries[e];
          }
        });
        var response = await service.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          ctrl.navs = [];
          angular.forEach(response.data.items, function (e) {
            e.disabled =
              $rootScope.findObjectByKey(ctrl.selectedList, "id", e.id) != null;
            // var item = {
            //     priority: e.priority,
            //     description: e.data.title,
            //     postId: e.id,
            //     image: e.thumbnailUrl,
            //     specificulture: e.specificulture,
            //     status: 'Published',
            //     isActived: false
            // };
            // item[ctrl.srcField] = ctrl.srcId;
            // ctrl.navs.push(item);
          });
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.select = function (value, isSelected) {
        if (isSelected) {
          if (ctrl.parentId) {
            var nav = {
              mixDatabaseName: ctrl.mixDatabaseName,
              parentId: ctrl.parentId,
              parentType: ctrl.parentType,
              id: value,
            };
            navService.save(nav).then((resp) => {
              if (resp.isSucceed) {
                var current = $rootScope.findObjectByKey(
                  ctrl.selectedList,
                  "id",
                  data.id
                );
                if (!current) {
                  data.disabled = true;
                  ctrl.selectedList.push(data);
                }
                $rootScope.showMessage("success", "success");
                $rootScope.isBusy = false;
                $scope.$apply();
              } else {
                $rootScope.showMessage("failed");
                $rootScope.isBusy = false;
                $scope.$apply();
              }
            });
          } else {
            var current = $rootScope.findObjectByKey(
              ctrl.selectedList,
              "id",
              data.id
            );
            if (!current) {
              data.disabled = true;
              ctrl.selectedList.push(data);
            }
          }
        } else {
          if (ctrl.parentId) {
            navService
              .delete([ctrl.parentId, ctrl.parentType, data.id])
              .then((resp) => {
                if (resp.isSucceed) {
                  data.disabled = false;
                  var tmp = $rootScope.findObjectByKey(
                    ctrl.data.items,
                    "id",
                    data.id
                  );
                  if (tmp) {
                    tmp.disabled = false;
                  }
                  $rootScope.removeObjectByKey(
                    ctrl.selectedList,
                    "id",
                    data.id
                  );
                  $rootScope.showMessage("success", "success");
                  $rootScope.isBusy = false;
                  $scope.$apply();
                } else {
                  $rootScope.showMessage("failed");
                  $rootScope.isBusy = false;
                  $scope.$apply();
                }
              });
          } else {
            data.disabled = false;
            var tmp = $rootScope.findObjectByKey(
              ctrl.data.items,
              "id",
              data.id
            );
            if (tmp) {
              tmp.disabled = false;
            }
            $rootScope.removeObjectByKey(ctrl.selectedList, "id", data.id);
          }
        }
        if (ctrl.selectCallback) {
          ctrl.selectCallback({ data: data });
        }
      };
      ctrl.createData = function () {
        var data = {
          title: ctrl.newTitle,
          slug: $rootScope.generateKeyword(ctrl.newTitle, "-"),
          type: ctrl.type,
        };
        service.saveByName(ctrl.mixDatabaseName, data).then((resp) => {
          if (resp.isSucceed) {
            ctrl.data.items.push(resp.data);
            $rootScope.showMessage("success", "success");
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            $rootScope.showMessage("failed");
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        });
      };
    },
  ],
});
