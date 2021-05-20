modules.component("mixDatabaseDataFilter", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-database-data-filter/view.html",
  bindings: {
    query: "=",
    mixDatabaseName: "=?",
    mixDatabaseId: "=?",
    selectedList: "=",
    initData: "=?",
    columns: "=?",
    selected: "=",
    callback: "&?",
    save: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestMixDatabaseDataPortalService",
    function ($rootScope, $scope, ngAppSettings, dataService) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.types = ["Page", "Post"];
      ctrl.type = "Page";
      ctrl.navs = [];
      ctrl.data = { items: [] };
      ctrl.goToPath = $rootScope.goToPath;
      ctrl.$onInit = function () {
        if (ctrl.initData) {
          ctrl.data = ctrl.initData;
        } else {
          ctrl.loadData();
        }
      };
      ctrl.loadData = async function (pageIndex) {
        ctrl.isBusy = true;

        // ctrl.request.query = ctrl.query + ctrl.srcId;
        ctrl.navs = [];
        if (pageIndex !== undefined) {
          ctrl.request.pageIndex = pageIndex;
        }
        if (ctrl.request.fromDate !== null) {
          var df = new Date(ctrl.request.fromDate);
          ctrl.request.fromDate = df.toISOString();
        }
        if (ctrl.request.toDate !== null) {
          var dt = new Date(ctrl.request.toDate);
          ctrl.request.toDate = dt.toISOString();
        }
        if (ctrl.mixDatabaseId) {
          ctrl.request.mixDatabaseId = ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.mixDatabaseName = ctrl.mixDatabaseName;
        }
        if (ctrl.filterType) {
          ctrl.request.filterType = ctrl.filterType;
        }

        var response = await dataService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          ctrl.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          ctrl.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.edit = function (nav) {
        switch (ctrl.type) {
          case "Page":
            ctrl.goToPath(`/portal/page/details/${nav.id}`);
            break;
          case "Post":
            ctrl.goToPath(`/portal/post/details/${nav.id}`);
            break;
          case "Module":
            ctrl.goToPath(`/portal/module/details/${nav.id}`);
            break;
        }
      };
      ctrl.onClose = function () {
        ctrl.callback();
      };
      ctrl.select = function (nav) {
        var current = $rootScope.findObjectByKey(ctrl.data.items, "id", nav.id);
        if (!nav.isActive && ctrl.callback) {
          ctrl.callback({ nav: nav });
        }
        if (ctrl.isMultiple) {
          current.isActive = !current.isActive;
        } else {
          if (!nav.isActive) {
            angular.forEach(ctrl.data.items, (element) => {
              element.isActive = false;
            });
          }
          current.isActive = !nav.isActive;
        }
      };
      ctrl.saveSelected = function () {
        ctrl.selected = $rootScope.filterArray(
          ctrl.data,
          ["isActived"],
          [true]
        );
        setTimeout(() => {
          ctrl.save().then(() => {
            ctrl.loadPosts();
          });
        }, 500);
      };
      ctrl.limString = function (str, max) {
        if (str) {
          return str.length > max ? str.substring(0, max) + " ..." : str;
        }
      };
    },
  ],
});
