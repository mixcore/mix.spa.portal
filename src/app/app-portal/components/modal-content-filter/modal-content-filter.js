modules.component("modalContentFilter", {
  templateUrl:
    "/mix-app/views/app-portal/components/modal-content-filter/modal-content-filter.html",
  bindings: {
    query: "=",
    initData: "=?",
    selected: "=",
    callback: "&?",
    save: "&?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "PostRestService",
    "PageRestService",
    "ModuleRestService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      postService,
      pageService,
      moduleService
    ) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.types = ["Page", "Post", "Module"];
      ctrl.moduleId = null;
      ctrl.type = "Page";
      ctrl.navs = [];
      ctrl.data = {
        items: [],
      };
      // ctrl.goToPath = $rootScope.goToPath;
      ctrl.$onInit = function () {
        $("#modal-content-filter").on("shown.bs.modal", function () {
          if (ctrl.initData) {
            ctrl.data = ctrl.initData;
          } else {
            if (!ctrl.data.items.length) {
              ctrl.loadData();
            }
          }
        });
      };
      ctrl.closeDialog = function () {
        $("#modal-content-filter").modal("hide");
      };
      ctrl.loadData = async function (pageIndex) {
        ctrl.request.query = ctrl.query + ctrl.srcId;
        ctrl.navs = [];
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

        switch (ctrl.type) {
          case "Page":
            ctrl.loadPages();
            break;
          case "Post":
            ctrl.loadPosts();
            break;
          case "Module":
            ctrl.loadModules();
            break;
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
      ctrl.loadModules = async function () {
        $rootScope.isBusy = true;
        var response = await moduleService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.loadPosts = async function () {
        $rootScope.isBusy = true;
        var response = await postService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.loadPages = async function () {
        $rootScope.isBusy = true;
        var response = await pageService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.select = function (nav) {
        var current = $rootScope.findObjectByKey(ctrl.data.items, "id", nav.id);
        if (!nav.isActive && ctrl.callback) {
          ctrl.callback({
            nav: nav,
            type: ctrl.type,
          });
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
