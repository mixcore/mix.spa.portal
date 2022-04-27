modules.component("modalNavMetas", {
  templateUrl: "/mix-app/views/app-portal/components/modal-nav-metas/view.html",
  bindings: {
    header: "=",
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    intParentId: "=?",
    guidParentId: "=?",
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

      ctrl.$onInit = async function () {
        await ctrl.loadDefaultModel();
        await ctrl.loadDefaultData();
        await ctrl.loadSelected();
        ctrl.loadData();
        ctrl.filterData();
      };

      ctrl.loadSelected = async function () {
        ctrl.navRequest = angular.copy(ngAppSettings.request);
        ctrl.navRequest.mixDatabaseId = ctrl.mixDatabaseId;
        ctrl.navRequest.mixDatabaseName = ctrl.mixDatabaseName;
        ctrl.navRequest.intParentId = ctrl.intParentId;
        ctrl.navRequest.guidParentId = ctrl.guidParentId;
        var getSelected = await navService.getList(ctrl.navRequest);
        if (getSelected.success) {
          ctrl.selectedList = getSelected.data;
          ctrl.selectedValues = ctrl.selectedList.items.map(
            (m) => m.dataContentId
          );
          $scope.$apply();
        }
      };
      ctrl.loadDefaultModel = async function () {
        ctrl.request.isGroup = true;

        if (ctrl.mixDatabaseId) {
          ctrl.request.mixDatabaseId = ctrl.mixDatabaseId;
        }
        if (ctrl.mixDatabaseName) {
          ctrl.request.mixDatabaseName = ctrl.mixDatabaseName;
        }
        if ($routeParams.intParentId) {
          ctrl.intParentId = $routeParams.intParentId;
        }
        if ($routeParams.parentType) {
          ctrl.parentType = $routeParams.parentType;
        }
        ctrl.defaultNav = {
          id: null,
          specificulture: navService.lang,
          dataContentId: null,
          intParentId: ctrl.intParentId,
          parentType: ctrl.parentType,
          mixDatabaseId: ctrl.mixDatabaseId,
          mixDatabaseName: ctrl.mixDatabaseName,
          status: "Published",
          childDataContent: null,
        };
        if (!ctrl.columns) {
          var getMixDatbase = ctrl.mixDatabaseId
            ? await databaseService.getSingle([ctrl.mixDatabaseId])
            : await databaseService.getByName([ctrl.mixDatabaseName]);
          if (getMixDatbase.success) {
            ctrl.columns = getMixDatbase.data.columns;
            ctrl.mixDatabaseId = getMixDatbase.data.id;
            ctrl.mixDatabaseName = getMixDatbase.data.systemName;
            ctrl.defaultNav.mixDatabaseId = getMixDatbase.data.id;
            ctrl.defaultNav.mixDatabaseName = getMixDatbase.data.systemName;
            $scope.$apply();
          }
        }
      };
      ctrl.loadDefaultData = async function () {
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
        if (!ctrl.mixDatabaseId) {
          ctrl.mixDatabaseId = ctrl.defaultData.mixDatabaseId;
        }
        if (!ctrl.mixDatabaseName) {
          ctrl.mixDatabaseName = ctrl.defaultData.mixDatabaseName;
        }
      };
      ctrl.isSelected = function (value, level) {
        let item = $rootScope.findObjectByKey(
          ctrl.selectedList.items,
          "dataContentId",
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
        if (response.success) {
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
        angular.forEach(ctrl.selectedList.items, function (e) {
          var subIds = [];
          e.isActived = e.isActived === undefined ? true : e.isActived;
          if (e.childDataContent && e.childDataContent.data.childItems) {
            angular.forEach(e.childDataContent.data.childItems, function (sub) {
              sub.isActived = ctrl.selectedValues.indexOf(e.id) >= 0;
            });
            subIds = e.childDataContent.data.childItems.map((m) => m.id);
          } else if (e.childItems) {
            subIds = e.childItems.map((m) => m.id);
          }
          var subData = ctrl.selectedList.items.filter(
            (m) => subIds.indexOf(m.dataContentId) >= 0
          );
          angular.forEach(subData, function (s) {
            s.disabled = true;
          });
        });
      };
      ctrl.select = async function (dataContentId, isSelected, level) {
        let idx = ctrl.selectedValues.indexOf(dataContentId);
        var nav = ctrl.selectedList.items[idx];
        if (!nav) {
          ctrl.selectedValues.push(dataContentId);
          nav = angular.copy(ctrl.defaultNav);
          nav.dataContentId = dataContentId;
          nav.childDataContent = $rootScope.findObjectByKey(
            ctrl.data.items,
            "id",
            dataContentId
          );
          ctrl.selectedList.items.push(nav);
        }
        nav.level = level;
        if (isSelected) {
          nav.isActived = true;
          if (nav.intParentId) {
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
        var nav = ctrl.selectedList.items[idx];
        ctrl.selectedValues.splice(idx, 1);
        ctrl.selectedList.items.splice(idx, 1);
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
            ctrl.mixDatabaseData.intParentId = 0;
            ctrl.mixDatabaseData.parentType = "Set";
            ctrl.mixDatabaseData.data.title = ctrl.newTitle;
            ctrl.mixDatabaseData.data.slug = $rootScope.generateKeyword(
              ctrl.newTitle,
              "-"
            );
            ctrl.mixDatabaseData.data.type = ctrl.type;
            dataService.save(ctrl.mixDatabaseData).then((resp) => {
              if (resp.success) {
                ctrl.mixDatabaseData.id = resp.data;
                ctrl.data.items.push(ctrl.mixDatabaseData);
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
