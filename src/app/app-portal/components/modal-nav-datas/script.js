modules.component("modalNavDatas", {
  templateUrl: "/mix-app/views/app-portal/components/modal-nav-datas/view.html",
  bindings: {
    mixDatabaseId: "=?",
    mixDatabaseName: "=?",
    parentDatabaseName: "=?",
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
    "$location",
    "$routeParams",
    "ngAppSettings",
    "RestMixAssociationPortalService",
    "RestMixDatabasePortalService",
    "MixDbService",
    function (
      $rootScope,
      $scope,
      $location,
      $routeParams,
      ngAppSettings,
      associationService,
      databaseService,
      dataService
    ) {
      var ctrl = this;
      ctrl.request = angular.copy(ngAppSettings.request);
      ctrl.navs = [];

      ctrl.queries = {};
      ctrl.data = { items: [] };
      ctrl.$onInit = async function () {
        ctrl.association = {
          parentId: ctrl.parentId,
          parentDatabaseName: ctrl.parentDatabaseName,
          childDatabaseName: ctrl.mixDatabaseName,
        };
        dataService.initDbName(ctrl.mixDatabaseName);
        ctrl.request.name = ctrl.mixDatabaseName;
        ctrl.request.parentName = ctrl.parentName;
        // ctrl.request.parentId = ctrl.parentId;
        if (!ctrl.database) {
          var getDatabase = await databaseService.getByName(
            ctrl.mixDatabaseName
          );
          if (getDatabase.success) {
            ctrl.database = getDatabase.data;
            $scope.$apply();
          }
        }
        if (!ctrl.data) {
          await ctrl.loadData();
        }
      };
      ctrl.select = async (item) => {
        if (item.isSelected) {
          ctrl.association.childId = item.id;
          return await associationService.save(ctrl.association);
        }
      };
      ctrl.filter = function () {
        ctrl.data = [];
        ctrl.loadData();
      };
      ctrl.loadData = async function () {
        dataService.initDbName(ctrl.mixDatabaseName);
        ctrl.request.queries = [];
        if (ctrl.queries) {
          Object.keys(ctrl.queries).forEach((e) => {
            if (ctrl.queries[e]) {
              ctrl.request.queries.push({
                fieldName: e,
                value: ctrl.queries[e],
              });
            }
          });
        }
        var getData = await dataService.filter(ctrl.request);
        ctrl.data = getData.data;
        $scope.$apply();
      };
      ctrl.update = function (data) {
        let url = `/admin/mix-database-data/details?dataContentId=${
          data.id
        }&mixDatabaseName=${ctrl.mixDatabaseName}&mixDatabaseTitle=${
          ctrl.mixDatabaseTitle
        }&parentId=${ctrl.parentId || ""}&parentName=${ctrl.parentName || ""}`;
        $location.url(url);
      };
    },
  ],
});
