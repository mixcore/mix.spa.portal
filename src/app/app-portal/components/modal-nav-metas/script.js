modules.component("modalNavMetas", {
  templateUrl: "/mix-app/views/app-portal/components/modal-nav-metas/view.html",
  bindings: {
    header: "=",
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    parentId: "=?",
    parentType: "=?",
    type: "=?",
    columnDisplay: "=?",
    isOpen: "=?",
    selectedList: "=?",
    selectCallback: "&?",
    save: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$routeParams",
    "ngAppSettings",
    "RestMixDatabaseDataPortalService",
    "RestRelatedAttributeDataPortalService",
    "RestMixDatabasePortalService",
    function (
      $rootScope,
      $scope,
      $routeParams,
      ngAppSettings,
      dataService,
      navService,
      databaseService
    ) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.request.key = "readData";
      ctrl.navs = [];

      ctrl.queries = {};
      ctrl.data = { items: [] };
      ctrl.selectedValues = [];
      ctrl.$onInit = function () {
        ctrl.request.isGroup = true;
        if (!ctrl.selectedList) {
          ctrl.selectedList = [];
        }
        ctrl.selectedValues = ctrl.selectedList.map((m) => m.dataId);
        if (ctrl.mixDatabaseId) {
          ctrl.request.mixDatabaseId = ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.mixDatabaseName = ctrl.mixDatabaseName;
        }
        ctrl.loadDefaultModel();
        ctrl.loadData();
        ctrl.filterData();
      };
      ctrl.loadDefaultModel = async function () {
        ctrl.defaultNav = {
          id: null,
          specificulture: navService.lang,
          dataId: null,
          parentId: ctrl.parentId,
          parentType: ctrl.parentType,
          mixDatabaseId: ctrl.mixDatabaseId,
          mixDatabaseName: ctrl.mixDatabaseName,
          status: "Published",
          attributeData: null,
        };
        if ($routeParams.parentId) {
          ctrl.parentId = $routeParams.parentId;
        }
        if ($routeParams.parentType) {
          ctrl.parentType = $routeParams.parentType;
        }
        if (!ctrl.columns) {
          var getMixDatbase = await databaseService.getSingle([
            ctrl.mixDatabaseName || ctrl.mixDatabaseId,
          ]);
          if (getMixDatbase.isSucceed) {
            ctrl.columns = getMixDatbase.data.columns;
            ctrl.mixDatabaseId = getMixDatbase.data.id;
            ctrl.mixDatabaseName = getMixDatbase.data.name;
            ctrl.defaultNav.mixDatabaseId = getMixDatbase.data.id;
            ctrl.defaultNav.mixDatabaseName = getMixDatbase.data.name;
            $scope.$apply();
          }
        }
        var getDefault = await dataService.initData(
          ctrl.mixDatabaseName || ctrl.mixDatabaseId
        );
        ctrl.defaultData = getDefault.data;
        if (ctrl.defaultData) {
          ctrl.defaultData.mixDatabaseId = ctrl.mixDatabaseId || 0;
          ctrl.defaultData.mixDatabaseName = ctrl.mixDatabaseName;
        }

        if (!ctrl.mixDatabaseData) {
          ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
        }
      };
      ctrl.isSelected = function (value, level) {
        let item = $rootScope.findObjectByKey(
          ctrl.selectedList,
          "dataId",
          value
        );
        if (item) {
          item.level = level;
        }
        return ctrl.selectedValues.indexOf(value) >= 0;
      };
      ctrl.reload = async function () {
        ctrl.newTitle = "";
        ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
      };
      ctrl.loadData = async function (pageIndex) {
        ctrl.request.query = "{}";
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
          ctrl.request.mixDatabaseId = ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.mixDatabaseName = ctrl.mixDatabaseName;
        }
        if (ctrl.type) {
          ctrl.request.type = ctrl.type;
        }
        Object.keys(ctrl.queries).forEach((e) => {
          if (ctrl.queries[e]) {
            ctrl.request[e] = ctrl.queries[e];
          }
        });
        ctrl.request.key = "data";
        var response = await dataService.getList(ctrl.request);
        if (response.isSucceed) {
          ctrl.data = response.data;
          ctrl.filterData();
          ctrl.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          ctrl.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.filterData = function () {
        angular.forEach(ctrl.data.items, function (e) {
          // Not show data if there's in selected list
          e.disabled = ctrl.selectedValues.indexOf(e.id) >= 0;
        });
        angular.forEach(ctrl.selectedList, function (e) {
          var subIds = [];
          e.isActived = e.isActived === undefined ? true : e.isActived;
          if (e.attributeData && e.attributeData.obj.childItems) {
            angular.forEach(e.attributeData.obj.childItems, function (sub) {
              sub.isActived = ctrl.selectedValues.indexOf(e.id) >= 0;
            });
            subIds = e.attributeData.obj.childItems.map((m) => m.id);
          } else if (e.childItems) {
            subIds = e.childItems.map((m) => m.id);
          }
          var subData = ctrl.selectedList.filter(
            (m) => subIds.indexOf(m.dataId) >= 0
          );
          angular.forEach(subData, function (s) {
            s.disabled = true;
          });
        });
      };
      ctrl.select = async function (dataId, isSelected, level) {
        let idx = ctrl.selectedValues.indexOf(dataId);
        var nav = ctrl.selectedList[idx];
        if (!nav) {
          ctrl.selectedValues.push(dataId);
          nav = angular.copy(ctrl.defaultNav);
          nav.dataId = dataId;
          nav.attributeData = $rootScope.findObjectByKey(
            ctrl.data.items,
            "id",
            dataId
          );
          ctrl.selectedList.push(nav);
        }
        nav.level = level;
        if (isSelected) {
          nav.isActived = true;
          if (nav.parentId) {
            var saveResult = await navService.save(nav);
            nav.id = saveResult.data.id;
            $rootScope.showMessage("success", "success");
            ctrl.filterData();
            $scope.$apply();
          }
        }

        if (!isSelected) {
          await ctrl.removeNav(idx);
          if (ctrl.selectCallback) {
            ctrl.selectCallback({ data: nav });
          }
          return;
        }
      };
      ctrl.removeNav = async function (idx) {
        var nav = ctrl.selectedList[idx];
        ctrl.selectedValues.splice(idx, 1);
        ctrl.selectedList.splice(idx, 1);
        ctrl.filterData();
        if (nav && nav.id) {
          await navService.delete([nav.id]);
          $rootScope.showMessage("success", "success");
          $scope.$apply();
        }
      };
      ctrl.disableNavitem = function (nav, isDisable) {
        nav.disabled = isDisable;
      };
      ctrl.createData = function () {
        if (ctrl.newTitle) {
          var tmp = $rootScope.findObjectByKey(
            ctrl.data.items,
            "title",
            ctrl.newTitle
          );
          if (!tmp) {
            ctrl.isBusy = true;
            ctrl.mixDatabaseData.parentId = 0;
            ctrl.mixDatabaseData.parentType = "Set";
            ctrl.mixDatabaseData.obj.title = ctrl.newTitle;
            ctrl.mixDatabaseData.obj.slug = $rootScope.generateKeyword(
              ctrl.newTitle,
              "-"
            );
            ctrl.mixDatabaseData.obj.type = ctrl.type;
            dataService.save(ctrl.mixDatabaseData).then((resp) => {
              if (resp.isSucceed) {
                ctrl.data.items.push(resp.data);
                ctrl.reload();
                ctrl.select(resp.data.id, true);
                ctrl.filterData();
                ctrl.isBusy = false;
                $scope.$apply();
              } else {
                $rootScope.showErrors(resp.errors);
                ctrl.isBusy = false;
                $scope.$apply();
              }
            });
          } else {
            tmp.isActived = true;
            ctrl.select(tmp);
          }
        }
      };
    },
  ],
});
